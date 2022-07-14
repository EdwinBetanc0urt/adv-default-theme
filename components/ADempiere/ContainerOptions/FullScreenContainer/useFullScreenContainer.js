// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { computed } from '@vue/composition-api'

import store from '@/store'

export default ({ parentUuid, containerUuid }) => {
  const storedWindow = computed(() => {
    return store.getters.getStoredWindow(parentUuid)
  })

  const storedTab = computed(() => {
    return store.getters.getStoredTab(
      parentUuid,
      containerUuid
    )
  })

  const isViewFullScreenParent = computed(() => {
    return storedWindow.value.isFullScreenTabsParent
  })

  const isViewFullScreenChild = computed(() => {
    return storedWindow.value.isFullScreenTabsChildren
  })

  const isViewFullScreen = computed(() => {
    if (storedTab.isParentTab) {
      return isViewFullScreenParent.value
    }
    return isViewFullScreenChild.value
  })

  const iconFullScreen = computed(() => {
    if (isViewFullScreen.value) {
      return 'exit-fullscreen'
    }
    return 'fullscreen'
  })

  function changeFullScreenParent() {
    store.commit('changeWindowAttribute', {
      uuid: parentUuid,
      attributeName: 'isFullScreenTabsParent',
      attributeValue: !isViewFullScreenParent.value
    })
  }

  function changeFullScreenChild() {
    store.commit('changeWindowAttribute', {
      uuid: parentUuid,
      attributeName: 'isFullScreenTabsChildren',
      attributeValue: !isViewFullScreenChild.value
    })
  }

  function changeFullScreen() {
    if (storedTab.value.isParentTab) {
      changeFullScreenParent()
      return
    }
    changeFullScreenChild()
  }

  return {
    isViewFullScreen,
    isViewFullScreenParent,
    isViewFullScreenChild,
    iconFullScreen,
    storedWindow,
    changeFullScreen,
    changeFullScreenParent,
    changeFullScreenChild
  }
}