<template>
  <div class="exhibitions-container">
    <div class="exhibitions-header">
      <h1 class="exhibitions-title">{{ $t("message.exhibitions_title") }}</h1>
      <div class="exhibitions-subtitle">
        {{ $t("message.exhibitions_subtitle") }}
      </div>
    </div>
    <div class="exhibitions-links">
      <a class="exhibitions-link" @click.prevent="$router.push({ name: 'LandEmbodied' })" href="#">{{ $t("message.exhibitions_land_embodied") }}</a>
      <a class="exhibitions-link" @click.prevent="$router.push({ name: 'NothingToLose' })" href="#">{{ $t("message.exhibitions_nothing_to_lose") }}</a>
      <a class="exhibitions-link" @click.prevent="$router.push({ name: 'Recipe' })" href="#">{{ $t("message.exhibitions_alcoholic_lab") }}</a>
    </div>
    <div class="exhibitions-image-container">
      <img class="exhibitions-image" src="@/assets/18_hyperreality-china01.jpg" alt="Zeng Han, Hyperreality China01 Beijing Paused Bridge 2006" />
      <div class="exhibitions-caption">
        {{ $t("message.exhibitions_image_caption") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Exhibitions',
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style scoped>
.exhibitions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  padding-bottom: 60px;
}

.exhibitions-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
}

.exhibitions-title {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 70px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -2.8px;
  margin: 0;
}

.exhibitions-subtitle {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -1.4px;
}

.exhibitions-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.exhibitions-link {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 35px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.4px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;
}

.exhibitions-image-container {
  display: flex;
  width: 806px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 0px;
}

.exhibitions-image {
  width: 510px;
  height: 408px;
  aspect-ratio: 5/4;
  object-fit: cover;
  display: block;
}

.exhibitions-caption {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -1px;
}

@media (max-width: 768px) {
  .exhibitions-container {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style> 