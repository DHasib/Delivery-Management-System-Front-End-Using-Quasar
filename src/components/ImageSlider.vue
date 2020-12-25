<template>
  <div>
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg">
        <div class="column no-wrap flex-center q-carousel--padding">
          <q-icon name="layers" size="56px" />
          <div
            class="q-mt-md text-h6 text-white"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum hic doloribus voluptatibus assumenda amet a omnis dolores molestias veniam perferendis ipsa culpa cupiditate laborum voluptates porro exercitationem, nesciunt dicta eveniet rem eius provident! Explicabo dolore similique, ipsum dolorem esse repellat deserunt molestias nemo ipsam, aut, in nulla? Eligendi temporibus blanditiis possimus nulla voluptas magni laborum soluta porro veniam deserunt natus, nobis odit pariatur sint voluptatum,</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/mountains.jpg">
        <div class="column no-wrap flex-center q-carousel--padding">
          <q-icon name="layers" size="56px" />
          <div
            class="q-mt-md text-h6 text-white"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum hic doloribus voluptatibus assumenda amet a omnis dolores molestias veniam perferendis ipsa culpa cupiditate laborum voluptates porro exercitationem, nesciunt dicta eveniet rem eius provident! Explicabo dolore similique, ipsum dolorem esse repellat deserunt molestias nemo ipsam, aut, in nulla? Eligendi temporibus blanditiis possimus nulla voluptas magni laborum soluta porro veniam deserunt natus, nobis odit pariatur sint voluptatum,!</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/mountains.jpg">
        <div class="column no-wrap flex-center q-carousel--padding">
          <q-icon name="layers" size="56px" />
          <div
            class="q-mt-md text-h6 text-white"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum hic doloribus voluptatibus assumenda amet a omnis dolores molestias veniam perferendis ipsa culpa cupiditate laborum voluptates porro exercitationem, nesciunt dicta eveniet rem eius provident! Explicabo dolore similique, ipsum dolorem esse repellat deserunt molestias nemo ipsam, aut, in nulla? Eligendi temporibus blanditiis possimus nulla voluptas magni laborum soluta porro veniam deserunt natus, nobis odit pariatur sint voluptatum,</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
export default {

  name: 'ImageSlider',
  data () {
    return {
      slide: 1,
      autoplay: true
    }
  }
}
</script>
