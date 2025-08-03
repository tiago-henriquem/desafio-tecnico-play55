# Processo de Decisão: Evolução do Carrinho de Compras Interativo

**Data:** 2025-08-02
**Autor:** Renato Vasconcelos
**Contexto:** Evoluir o carrinho de compras de uma loja online Vue.js existente para incluir validação de estoque em tempo real e aplicação/validação de cupons de desconto, com foco em resiliência e feedback claro ao usuário.

---

## 1. Requisitos Principais

O objetivo é transformar o processo de "Confirmar Compra" em um fluxo mais inteligente e interativo, abrangendo:

* **Verificação de Estoque em Tempo Real:** Antes da finalização, validar a disponibilidade de cada item do carrinho via `POST /products/check-stock`.
* **Validação de Cupom de Desconto:** Permitir a inserção de cupom no carrinho, validando-o e aplicando o desconto.
* **Feedback Claro e Resiliente:** Informar o usuário sobre status (carregando, sucesso, erro), estoque indisponível ou cupom inválido, permitindo ajustes no carrinho sem perda de dados.

---

## 2. Design do Fluxo de Checkout e Experiência do Usuário (UX)

O fluxo deve guiar o usuário de forma clara, utilizando **toasts** como um dos principais componentes para feedback não-intrusivo.

### Sequência de Eventos e Mudanças de Estado na UI

1.  **Estado Inicial:** Carrinho exibindo itens, quantidades, total e campo para cupom (se já existir). Botão "Confirmar Compra" ativo.
2.  **Validação de Cupom (Novo Fluxo - `onBlur`):**
    * Usuário insere um código de cupom no campo e **foca fora do input (onBlur)**.
    * O campo do cupom exibe um **spinner** local ou fica desabilitado.
    * Uma chamada `GET` é feita para `/coupons/{couponCode}`.
    * **Resposta da Validação:**
        * **Cupom Válido:**
            * O desconto é aplicado e visualizado imediatamente no total do carrinho.
            * O campo do cupom pode exibir um **ícone de ✅**.
        * **Cupom Inválido:**
            * O campo do cupom pode exibir um **ícone de ❌** e uma mensagem de erro abaixo.
            * O desconto não é aplicado (ou é removido se um cupom anterior estava ativo).
3.  **Ação do Usuário:** Usuário clica em **"Confirmar Compra"**.
4.  **Estado de Carregamento (Global):**
    * O botão "Confirmar Compra" é **desabilitado** e seu texto muda para **"Verificando Carrinho..."** ou **"Processando..."**.
    * Um **spinner de carregamento global** pode aparecer, cobrindo levemente o carrinho para indicar que a UI está em processo.
5.  **Verificação de Estoque:**
    * Uma chamada `POST` é feita para `/products/check-stock` com todos os IDs e quantidades dos itens do carrinho.
6.  **Resposta da Verificação de Estoque:**
    * **Cenário A: Todos os itens em estoque.**
        * O spinner global desaparece.
        * O botão "Confirmar Compra" pode agora passar para **"Finalizar Compra"** e ficar ativo.
        * O processo pode prosseguir para uma etapa final (ex: tela de pagamento).
    * **Cenário B: Alguns ou todos os itens fora de estoque.**
        * O spinner global desaparece.
        * **Toast de Erro:** "Atenção! Alguns itens do seu carrinho não estão mais disponíveis."
        * **Itens esgotados são visualmente destacados** no carrinho (ex: fundo vermelho claro, texto "Esgotado", ícone de ❌).
        * O preço de itens esgotados pode ser riscado ou zerado temporariamente.
        * O botão "Confirmar Compra" permanece **desabilitado** ou muda para **"Ajustar Carrinho"**.
        * O usuário é forçado a ajustar o carrinho (remover itens esgotados, diminuir quantidade) antes de poder tentar novamente.
        * Um **Toast de Sucesso** pode aparecer se os itens esgotados forem removidos ou ajustados e a validação for reiniciada com sucesso.
7.  **Finalização da Compra:**
    * Após todas as verificações e validações (estoque e cupom), o botão "Confirmar Compra" (agora "Finalizar Compra") fica ativo e o usuário pode prosseguir para o pagamento final.

---

## 3. Gerenciamento de Estado para um Processo Complexo (Pinia)

Optaria por criar um **novo store Pinia dedicado ao checkout (`checkoutStore`)**, mantendo o `cartStore` focado na gestão dos itens do carrinho.

### Justificativa para um Novo Store (`checkoutStore`)

* **Princípio da Responsabilidade Única (SRP):** O `cartStore` gerencia os itens. O `checkoutStore` gerencia o *processo* de compra, suas etapas, validações e erros específicos do fluxo de checkout.
* **Modularidade e Clareza:** A separação facilita a leitura e manutenção do código, tornando mais claro onde a lógica e o estado de cada parte residem.
* **Escalabilidade:** Permite que o processo de checkout evolua (adição de etapas de pagamento, endereço, frete) sem poluir o `cartStore`.
* **Performance:** A reatividade granular do Pinia garante que mudanças no `checkoutStore` não afetem o `cartStore` desnecessariamente, e vice-versa.

### Modelagem do Estado no `checkoutStore`

```typescript
// stores/checkout.ts
import { defineStore } from 'pinia';
import { useCartStore } from './cart'; // Para acessar os itens do carrinho

interface ProductStockStatus {
  id: string;
  isAvailable: boolean;
  message?: string;
}

interface CouponStatus {
  code: string;
  isValid: boolean;
  discountValue: number;
  errorMessage?: string;
}

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    // Estado do processo geral
    isLoadingGlobal: false as boolean,
    currentCheckoutStep: 'IDLE' as 'IDLE' | 'CHECKING_STOCK' | 'FINALIZING',
    globalErrorMessage: null as string | null,

    // Estado da verificação de estoque
    stockValidationResults: [] as ProductStockStatus[],
    hasStockIssues: false as boolean,

    // Estado do cupom (mais independente)
    couponCodeInput: '' as string,
    couponStatus: null as CouponStatus | null,
    isCouponValidating: false as boolean,
  }),
  getters: {
    outOfStockItems: (state) => state.stockValidationResults.filter(item => !item.isAvailable),
    canFinalizePurchase: (state) =>
      !state.isLoadingGlobal && !state.hasStockIssues,
    finalTotalWithDiscount(state) {
      const cartStore = useCartStore();
      let total = cartStore.cartTotal;
      if (state.couponStatus?.isValid) {
        total -= state.couponStatus.discountValue;
      }
      return total;
    },
  },
  actions: {
    async setCouponCodeAndValidate(code: string) {
      this.couponCodeInput = code;
      if (code.length === 0) {
        this.couponStatus = null;
        return;
      }
      this.isCouponValidating = true;
      try {
        const response = await this.validateCouponAPI(code);
        if (response.isValid) {
          this.couponStatus = { code, isValid: true, discountValue: response.discountValue };
          // useToast().showSuccess("Cupom aplicado com sucesso!");
        } else {
          this.couponStatus = { code, isValid: false, discountValue: 0, errorMessage: response.errorMessage };
          // useToast().showError(response.errorMessage);
        }
      } catch (error: any) {
        this.couponStatus = { code, isValid: false, discountValue: 0, errorMessage: 'Erro na validação do cupom.' };
        // useToast().showError("Não foi possível validar o cupom no momento.");
      } finally {
        this.isCouponValidating = false;
      }
    },

    async processCheckoutFlow() {
      this.isLoadingGlobal = true;
      this.globalErrorMessage = null;
      this.stockValidationResults = [];
      this.hasStockIssues = false;
      this.currentCheckoutStep = 'CHECKING_STOCK';

      try {
        const cartStore = useCartStore();
        const productData = cartStore.items.map(item => ({ id: item.productId, quantity: item.quantity }));

        // 1. Verificação de Estoque
        const stockResponse = await this.checkStockAPI(productData);
        this.stockValidationResults = stockResponse;
        this.hasStockIssues = stockResponse.some(item => !item.isAvailable);

        if (this.hasStockIssues) {
          this.globalErrorMessage = "Problemas de estoque detectados. Por favor, ajuste seu carrinho.";
          // useToast().showError("Um ou mais itens esgotaram.");
          this.currentCheckoutStep = 'ERROR';
          return;
        }

        // 2. Continua para a finalização (cupom já foi validado no onBlur)
        this.currentCheckoutStep = 'FINALIZING';
        // await this.finalizeOrderAPI();

        this.currentCheckoutStep = 'COMPLETED';
        // useToast().showSuccess("Compra processada com sucesso!");

      } catch (error: any) {
        this.globalErrorMessage = error.message || "Ocorreu um erro inesperado no checkout.";
        // useToast().showError("Erro ao processar sua compra.");
        console.error("Erro no processo de checkout:", error);
      } finally {
        this.isLoadingGlobal = false;
      }
    },

    async checkStockAPI(products: { id: string, quantity: number }[]): Promise<ProductStockStatus[]> {
      // Implementação da chamada de API (via `useApiCall` e `productService`)
      return products.map(p => ({ id: p.id, isAvailable: true }));
    },

    async validateCouponAPI(code: string): Promise<{ isValid: boolean, discountValue: number, errorMessage?: string }> {
      // Implementação da chamada de API (via `useApiCall` e `couponService`)
      if (code === 'DESCONTO10') {
        return { isValid: true, discountValue: 10.00 };
      } else {
        return { isValid: false, discountValue: 0, errorMessage: 'Cupom inválido.' };
      }
    },

    resetCheckoutState() {
      this.isLoadingGlobal = false;
      this.currentCheckoutStep = 'IDLE';
      this.globalErrorMessage = null;
      this.stockValidationResults = [];
      this.hasStockIssues = false;
      // Não reseta o couponCodeInput nem couponStatus aqui se o usuário quiser manter o cupom
    }
  },
});