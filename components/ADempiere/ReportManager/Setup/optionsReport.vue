<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-card class="box-card">
    <div v-if="isShowTitle" slot="header" class="clearfix">
      <b>
        {{ $t('report.reportSettings') }}
      </b>
    </div>

    <div class="text item">
      <el-form
        label-position="top"
        label-width="10px"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row class="report-setup-preferences-fields" :gutter="20">
          <el-col :span="8">
            <el-form-item
              :label="$t('report.printFormats')"
              style="display: grid;"
            >
              <el-select
                v-model="currentPrintFormatUuid"
                style="display: contents;"
              >
                <el-option
                  v-for="(item, key) in reportPrintFormatsList"
                  :key="key"
                  :label="item.name"
                  :value="item.printFormatUuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('report.reportViews')"
              style="display: grid;"
            >
              <el-select
                v-model="currentReportViewUuid"
                style="display: contents;"
              >
                <el-option
                  v-for="(item, key) in reportViewsList"
                  :key="key"
                  :label="item.name"
                  :value="item.reportViewUuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('report.typeReport')"
              style="display: grid;"
            >
              <el-select
                v-model="currentReportType"
                style="display: contents;"
              >
                <el-option
                  v-for="(item, key) in reportFormatTypesList"
                  :key="key"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-row
      style="position: absolute; bottom: 1%; right: 2%;"
    >
      <el-col :span="24">
        <samp class="report-setup-footer">
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="handleClose()"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="runReport()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import store from '@/store'

// Constants
import { DEFAULT_REPORT_TYPE } from '@/utils/ADempiere/dictionary/report'

// Utils and Helper Methods
import useOptionsReport from './useOptionsReport.js'

export default defineComponent({
  name: 'OptionsReport',

  props: {
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    isShowTitle: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const {
      reportFormatTypesList,
      currentReportType,
      reportPrintFormatsList,
      defaulPrintFormat,
      currentPrintFormatUuid,
      reportViewsList,
      defaultReportView,
      currentReportViewUuid
    } = useOptionsReport({
      containerUuid: props.containerUuid
    })

    function handleClose() {
      store.commit('setShowPanelConfig', {
        containerUuid: props.containerUuid,
        value: false
      })
      currentReportViewUuid.value = defaultReportView.value.reportViewUuid
      currentPrintFormatUuid.value = defaulPrintFormat.value.printFormatUuid
      currentReportType.value = DEFAULT_REPORT_TYPE
    }

    function runReport() {
      store.dispatch('buildReport', {
        containerUuid: props.containerUuid,
        isSummary: true
      })
      store.commit('setShowPanelConfig', {
        containerUuid: props.containerUuid,
        value: false
      })
    }

    return {
      // Ref
      reportViewsList,
      currentReportType,
      reportPrintFormatsList,
      currentPrintFormatUuid,
      reportFormatTypesList,
      currentReportViewUuid,
      // methods
      handleClose,
      runReport
    }
  }
})
</script>

<style lang="scss">
.report-setup-preferences-fields {
  /**
   * Reduce the spacing between the form element and its label
   */
   .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
