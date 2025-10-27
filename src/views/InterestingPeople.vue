<template>
  <v-container>
    <div class="interesting-people-header">
      <h1 class="interesting-people-title">Interesting People</h1>
      <div class="interesting-people-subtitle">
        People I've met along the way who left an impression
      </div>
    </div>

    <div class="people-list">
      <div v-for="person in people" :key="person.id" class="person-card">
        <div class="person-header">
          <h2 class="person-name">{{ person.name }}</h2>
          <p class="person-met-at">{{ person.IMetThemAt }}</p>
        </div>
        
        <div class="stories-section">
          <h3 class="stories-title">Stories</h3>
          <div v-for="(story, index) in person.stories" :key="index" class="story-item">
            <a @click="viewStory(getStoryId(story))" class="story-link">{{ story.title }}</a>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, defineOptions } from 'vue'
import { useRouter } from 'vue-router'
import { stories } from "../utils/storyLink.js"
import peopleData from '../utils/peopleData.json'

defineOptions({
  name: 'InterestingPeople'
})

interface Story {
  person: string
  title: string
  article: string
  published?: string
}

interface PersonData {
  id: string
  name: string
  IMetThemAt: string
}

interface Person {
  id: string
  name: string
  IMetThemAt: string
  stories: Story[]
}

const router = useRouter()

// Group stories by person
const people = ref<Person[]>([])

const groupStoriesByPerson = () => {
  // Create a map of person ID to their stories
  const storiesMap = new Map<string, Story[]>()
  
  Object.values(stories as Record<string, Story>).forEach((story) => {
    // Only include published stories
    if (story.published === 'true' && story.person) {
      if (!storiesMap.has(story.person)) {
        storiesMap.set(story.person, [])
      }
      storiesMap.get(story.person)?.push(story)
    }
  })
  
  // Map people from peopleData.json with their stories
  people.value = peopleData.people
    .map((person: PersonData) => ({
      id: person.id,
      name: person.name,
      IMetThemAt: person.IMetThemAt,
      stories: storiesMap.get(person.id) || []
    }))
    .filter((person: Person) => person.stories.length > 0) // Only show people with published stories
}

const viewStory = (storyId: string) => {
  router.push({ name: "Story", query: { id: storyId } })
}

const getStoryId = (story: Story): string => {
  // Find the story ID from the stories object by matching article URL
  const entries = Object.entries(stories as Record<string, Story>)
  const found = entries.find(([_, s]) => s.article === story.article && s.title === story.title)
  return found ? found[0] : ''
}

onMounted(() => {
  window.scrollTo(0, 0)
  groupStoriesByPerson()
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


