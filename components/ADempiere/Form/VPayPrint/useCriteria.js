/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import store from '@/store'

import { computed } from '@vue/composition-api'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

function useCriteria() {
  // payment selection
  const storedPaymentSelectionsList = computed(() => {
    return store.getters.getPaymentsSelectionsList
  })

  const storedCurrentPaymentSelectionId = computed({
    set(newValue) {
      store.commit('setCurrentPaymentSelectionId', newValue)
    },
    get() {
      return store.getters.getCurrentPaymentSelectionId
    }
  })

  // payment rule
  const storedPaymentRulesList = computed(() => {
    return store.getters.getPaymentRulesList
  })

  const storedCurrentPaymentRuleId = computed({
    set(newValue) {
      store.commit('setCurrentPaymentRuleId', newValue)
    },
    get() {
      return store.getters.getCurrentPaymentRuleId
    }
  })

  const isReadOnly = computed(() => {
    const paymentSelectionId = storedCurrentPaymentSelectionId.value
    return isEmptyValue(paymentSelectionId) || paymentSelectionId <= 0
  })

  function getPaymentsSelectionsListFromServer() {
    return store.dispatch('getPaymentsSelectionsListFromServer', {
      searchValue: ''
    })
  }

  // function getDocumentSequenceFromServer(paymentSelectionId) {
  //   store.dispatch('getDocumentSequenceFromServer', {
  //     paymentSelectionId
  //   })
  // }

  function getPaymentSelectionFromServer(paymentSelectionId) {
    store.dispatch('getPaymentsSelectionFromServer', {
      id: paymentSelectionId
    })
  }

  function changePaymentSelection(paymentSelectionId) {
    getPaymentSelectionFromServer(paymentSelectionId)
    // getDocumentSequenceFromServer(paymentSelectionId)
  }

  function getPaymentRulesListFromServer() {
    const paymentSelectionId = storedCurrentPaymentSelectionId.value
    if (isEmptyValue(paymentSelectionId)) {
      showMessage({
        message: 'Selecccion de pago esta vacia',
        type: 'info'
      })
      return
    }

    return store.dispatch('getPaymentRulesListFromServer', {
      searchValue: '',
      paymentSelectionId
    })
  }

  return {
    storedPaymentSelectionsList,
    storedCurrentPaymentSelectionId,
    storedPaymentRulesList,
    storedCurrentPaymentRuleId,
    isReadOnly,
    getPaymentsSelectionsListFromServer,
    changePaymentSelection,
    getPaymentRulesListFromServer
  }
}

export default useCriteria
