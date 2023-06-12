<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <!-- Top Panel Labels / E Payment Selection Information -->
  <el-form
    :inline="true"
    class="form-min-label"
    label-position="top"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item
          label="Banco"
          style="margin-bottom: 0px;"
        >
          <b style="font-size: 18px;">
            {{ currentBank }}
          </b>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          :label="$t('VPayPrint.bankAccount')"
          style="margin-bottom: 0px;"
        >
          <b style="font-size: 18px;">
            {{ currentBankAccount }}
          </b>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          :label="$t('VPayPrint.currentBalance')"
          style="margin-bottom: 0px;"
        >
          <b style="font-size: 18px;">
            {{ currentBalance }}
          </b>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helpers Methods
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat.js'

export default defineComponent({
  name: 'PaymentSelectionDetail',

  setup() {
    const paymentSelectionDetail = computed(() => {
      return store.getters.getPaymentSelectionDetail
    })

    const currentBank = computed(() => {
      return paymentSelectionDetail.value.bank_account.bank_name
    })

    const currentBankAccount = computed(() => {
      return paymentSelectionDetail.value.bank_account.account_no
    })

    const currency = computed(() => {
      return paymentSelectionDetail.value.currency.iso_code
    })

    const currentBalance = computed(() => {
      return formatPrice({
        value: paymentSelectionDetail.value.bank_account.current_balance,
        currency: currency.value
      })
    })

    return {
      currentBank,
      currentBankAccount,
      currentBalance
    }
  }
})
</script>
