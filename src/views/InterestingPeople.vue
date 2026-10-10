<template>
  <div class="container">
    <div class="interesting-people-header">
      <h1 class="interesting-people-title">Interesting People</h1>
      <div class="interesting-people-subtitle">
        People I've met along the way who left an impression
      </div>
    </div>

    <div class="people-list">
      <div v-for="person in met" :key="person.id" class="person-card">
        <div class="person-header">
          <h2 class="person-name">{{ person.name }}</h2>
          <p class="person-met-at">{{ person.metAt }}</p>
        </div>
        
        <div class="stories-section">
          <h3 class="stories-title">Stories</h3>
          <div v-for="story in person.stories" :key="story.id" class="story-item">
            <RouterLink :to="{ name: 'Story', query: { id: story.id } }" class="story-link">{{ story.title }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineOptions } from 'vue'
import people from '../content/people.json'
import stories from '../content/stories.json'

defineOptions({
  name: 'InterestingPeople'
})

// Everyone with at least one published story, with those stories.
const met = people
  .map(person => ({ ...person, stories: stories.filter(s => s.published && s.person === person.id) }))
  .filter(person => person.stories.length)

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.interesting-people-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
}

.interesting-people-title {
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

.interesting-people-subtitle {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -1.4px;
}

.people-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.person-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 32px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.person-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.person-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.person-name {
  color: #FFF;
  font-family: "Helvetica Neue";
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1.4px;
  margin: 0 0 8px 0;
}

.person-met-at {
  color: #FFD738;
  font-family: "Helvetica Neue";
  font-size: 18px;
  font-weight: 400;
  letter-spacing: -0.5px;
  margin: 0;
}

.stories-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stories-title {
  color: #FFF;
  font-family: "Helvetica Neue";
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -1px;
  margin: 0 0 8px 0;
}

.story-item {
  padding-left: 20px;
  border-left: 3px solid rgba(255, 215, 56, 0.5);
  margin-bottom: 12px;
}

.story-link {
  color: #FFF;
  font-family: "Helvetica Neue";
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: -0.5px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  display: inline-block;
}

.story-link:hover {
  color: #FFD738;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .interesting-people-title {
    font-size: 40px;
    letter-spacing: -1.6px;
  }

  .interesting-people-subtitle {
    font-size: 20px;
    letter-spacing: -0.8px;
    padding: 0 16px;
  }

  .person-card {
    padding: 24px;
  }

  .person-name {
    font-size: 28px;
  }

  .person-met-at {
    font-size: 16px;
  }

  .story-text {
    font-size: 16px;
  }
}
</style>


