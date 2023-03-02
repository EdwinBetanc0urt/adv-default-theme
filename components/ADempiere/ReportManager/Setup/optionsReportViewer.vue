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

    <el-collapse v-model="activeCollapse">
      <el-collapse-item name="report-preferences">
        <template slot="title">
          <b style="font-size: 18px">
            {{ $t('report.preference') }}
            <i style="font-size: 18px;" class="el-icon-s-operation" />
          </b>
        </template>
        <el-card class="box-card">
          <div class="text item">
            <el-form
              label-position="top"
              label-width="10px"
              @submit.native.prevent="notSubmitForm"
            >
              <el-row class="report-view-setup-preferences-fields" :gutter="20">
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
                <el-col :span="8">
                  <el-form-item
                    :label="$t('report.summary')"
                    style="display: grid;"
                  >
                    <el-switch v-model="isSummaryReport" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-collapse-item>

      <!-- report parameters -->
      <el-collapse-item name="report-parameters">
        <template slot="title">
          <b style="font-size: 18px">
            {{ $t('actionMenu.changeParameters') }}
            <i style="font-size: 18px;" class="el-icon-set-up" />
          </b>
        </template>
        <component
          :is="componentRender"
          :container-uuid="containerUuid"
          :container-manager="containerManagerReportViwer"
          :is-tab-panel="true"
        />
      </el-collapse-item>
    </el-collapse>

    <el-row
      style="
        position: absolute;
        bottom: 1%;
        right: 2%;
      "
    >
      <el-col :span="24">
        <samp class="report-viewer-setup-footer">
          <el-button
            type="info"
            class="button-base-icon"
            plain
            @click="clearParameters();"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
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
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'
import lang from '@/lang'

// Components adn Mixins
import CollapseCriteria from '@theme/components/ADempiere/CollapseCriteria/index.vue'

// Utils and Helper Methods
import useOptionsReport from './useOptionsReport.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showNotification } from '@/utils/ADempiere/notification'

export default defineComponent({
  name: 'optionsReportViewer',

  components: {
    CollapseCriteria
  },

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

  setup(props, { root }) {
    const {
      reportFormatTypesList,
      currentReportType,
      reportPrintFormatsList,
      currentPrintFormatUuid,
      reportViewsList,
      currentReportViewUuid
    } = useOptionsReport({
      containerUuid: props.containerUuid
    })

    /**
     * Ref
     * @activeCollapse - @params - {Array} - (Nodes activating collapse *Note: Cannot be used if the node is accordion mode*)
     */
    const activeCollapse = ref(['report-preferences', 'report-parameters'])
    const isSummaryReport = ref(false)

    /**
     * Computed
     * @storedPanelReport - Attribute the Panel Report
     * @defaultParams - Parameters with which the report was executed
     * @isShowSetupReport - is to show the configuration report
     * @containerManagerReportViwer - Container Manager the Report Viwer
     * @componentRender - Import the Panel Definitions component
     */
    const tableName = computed(() => {
      const { tableName } = store.getters.getReportOutput(root.$route.params.instanceUuid)
      if (!isEmptyValue(tableName)) {
        return tableName
      }
      if (isEmptyValue(reportPrintFormatsList.value)) {
        return ''
      }
      const currentPrintFormat = reportPrintFormatsList.value.find(report => report.printFormatUuid === currentPrintFormatUuid.value)
      if (!isEmptyValue(currentPrintFormat)) {
        return currentPrintFormat.tableName
      }
      return reportPrintFormatsList.value.at().tableName
    })

    const storedPanelReport = computed(() => {
      return store.getters.getModalDialogManager({
        containerUuid: props.containerUuid
      })
    })

    const defaultParams = computed(() => {
      return store.getters.getReportOutput(root.$route.params.instanceUuid)
    })

    // const isShowSetupReport = computed(() => {
    //   return store.getters.getShowPanelConfig({ containerUuid: props.containerUuid })
    // })

    const containerManagerReportViwer = computed(() => {
      const modalDialogStored = storedPanelReport.value
      if (!isEmptyValue(modalDialogStored) && !isEmptyValue(modalDialogStored.containerManager)) {
        return {
          ...props.containerManager,
          ...modalDialogStored.containerManager
        }
      }
      return {
        ...props.containerManager
      }
    })

    const componentRender = computed(() => {
      return () => import('@theme/components/ADempiere/PanelDefinition/index.vue')
    })

    const findTagViwer = computed(() => {
      return store.getters.visitedViews.find(tag => tag.instanceUuid === root.$route.params.instanceUuid)
    })

    /**
     * Methods
     * @handleClose - Close Panel and Clean Value
     * @runReport - Run Report and Close Panel
     * @runReport - @params {Object} - Set in the field the parameters with which the report was run
     */
    function handleClose() {
      store.commit('setShowPanelConfig', {
        containerUuid: props.containerUuid,
        value: false
      })
      currentReportViewUuid.value = ''
      currentPrintFormatUuid.value = ''
      currentReportType.value = ''
      isSummaryReport.value = false
    }

    function runReport() {
      const reportDefinition = store.getters.getStoredReport(props.containerUuid)
      const reportOutputParams = store.getters.getReportParameters({
        containerUuid: props.containerUuid,
        fieldsList: reportDefinition.fieldsList
      })
      const { name, description } = store.getters.getReportOutput(root.$route.params.instanceUuid)
      showNotification({
        title: lang.t('notifications.processing'),
        message: name,
        summary: description,
        type: 'info'
      })
      store.dispatch('buildReport', {
        containerUuid: props.containerUuid,
        instanceUuid: root.$route.params.instanceUuid,
        isSummary: isSummaryReport.value,
        tableName: tableName.value,
        parametersList: reportOutputParams
      })
        .then(response => {
          store.dispatch('tagsView/delCachedView', findTagViwer.value).then(() => {
            const { fullPath } = findTagViwer.value
            this.$nextTick(() => {
              router.replace({
                path: '/redirect' + fullPath
              })
            })
          })
          showNotification({
            title: lang.t('notifications.succesful'),
            message: name,
            type: 'success'
          })
        })
        .catch(error => {
          showNotification({
            title: lang.t('notifications.error'),
            message: name,
            summary: error,
            type: 'error'
          })
        })
      store.commit('setShowPanelConfig', {
        containerUuid: props.containerUuid,
        value: false
      })
    }

    function defaultReport(report) {
      const { reportViewUuid, printFormatUuid, reportType } = report
      currentReportViewUuid.value = reportViewUuid
      currentPrintFormatUuid.value = printFormatUuid
      currentReportType.value = reportType
      isSummaryReport.value = false

      store.commit('setReportGenerated', {
        containerUuid: props.containerUuid,
        reportViewUuid,
        printFormatUuid,
        reportType,
        isSummary: isSummaryReport.value
      })
    }

    function clearParameters() {
      defaultReport(defaultParams.value)

      store.dispatch('setReportDefaultValues', {
        containerUuid: props.containerUuid
      })
    }

    // watch(isShowSetupReport, (newValue) => {
    //   if (newValue) {
    //     defaultReport(defaultParams.value)
    //   }
    // })

    watch(isSummaryReport, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        store.commit('setReportGenerated', {
          containerUuid: props.containerUuid,
          printFormatUuid: currentPrintFormatUuid.value,
          reportType: currentReportType.value,
          reportViewUuid: currentReportViewUuid.value,
          isSummary: newValue
        })
      }
    })

    return {
      // Ref
      activeCollapse,
      isSummaryReport,
      // Computeds
      reportFormatTypesList,
      currentReportType,
      reportPrintFormatsList,
      currentPrintFormatUuid,
      reportViewsList,
      currentReportViewUuid,
      // Components
      tableName,
      storedPanelReport,
      defaultParams,
      // isShowSetupReport,
      containerManagerReportViwer,
      componentRender,
      findTagViwer,
      // methods
      clearParameters,
      handleClose,
      runReport,
      defaultReport
    }
  }
})
</script>

<style lang="scss">
.report-view-setup-preferences-fields {
  /**
   * Reduce the spacing between the form element and its label
   */
   .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
