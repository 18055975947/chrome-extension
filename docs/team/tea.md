---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'
</script>

<VPTeamPage style="margin: 0px">
  <VPTeamPageTitle style="border: none;">
    <template #title>
      打赏作者，喝杯热茶
    </template>
    <template #lead>
      <div style="display: flex; justify-content: center;">
        <img src="/team/tea.svg" />
      </div>
      <div style="display: flex; justify-content: center;">
        <img src="/team/wx.jpg" />
        <img src="/team/zfb.jpg" />
      </div>
    </template>
  </VPTeamPageTitle>
</VPTeamPage>