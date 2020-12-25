<template>
  <q-page>
    <div class="row">
      <imageSlider></imageSlider>
    </div>
    <div class="row q-ma-xl">
      <aboutUs></aboutUs>
    </div>
    <whatWeDo></whatWeDo>
    <div class="row">
      <ourPartner></ourPartner>
    </div>
    <joinus></joinus>
    <needHelp></needHelp>
  </q-page>
</template>

<script>
import imageSlider from 'components/ImageSlider'
import aboutUs from 'components/AboutUs'
import joinus from 'components/JoinUs'
import ourPartner from 'components/OurPartners'
import whatWeDo from 'components/WhatWeDo'
import needHelp from 'components/NeedHelp'
export default {
  name: 'HomePage',
  components: {
    imageSlider,
    aboutUs,
    joinus,
    ourPartner,
    whatWeDo,
    needHelp,
  },
  
}
</script>
