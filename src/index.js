import config from 'config'

import fetch from './fetch.js'

async function findAllProjectsFromGroup(groupId, page = 1, perPage = 100) {
  let list = []
  const projects = await fetch('/groups/:id/projects'.replace(':id', groupId) + `?simple=true&include_subgroups=true&page=${page}&per_page=${perPage}`)
  console.log('Found projects (total: %o, page: %o) from group.id %o', projects.length, page, groupId)
  list.push(...projects)
  if (projects.length >= perPage) {
    list.push(...await findAllProjectsFromGroup(groupId, ++page, perPage))
  }
  return list
}
async function removeHooksFromProject(projectId) {
  const hooks = await fetch('/projects/:id/hooks'.replace(':id', projectId))
  let jobs = []
  for (const hook of hooks) {
    const url = '/projects/:id/hooks/:hook_id'.replace(':id', projectId).replace(':hook_id', hook.id)
    console.log('remove hook: %o', url)
    jobs.push(fetch(url, {
      method: 'DELETE',
    }))
  }
  return await Promise.all(jobs)
}
async function addHooksToProject(projectId, hooks = []) {
  let jobs = []
  for (const hook of hooks) {
    const url = '/projects/:id/hooks'.replace(':id', projectId)
    console.log('add hook: %o', url)
    jobs.push(fetch(url, {
      method: 'POST',
      body: JSON.stringify(hook)
    }))
  }
  return await Promise.all(jobs)
}
async function syncHooksToProject(projectId, hooks) {
  const r1 = await removeHooksFromProject(projectId)
  // console.log(r1)
  const r2 = await addHooksToProject(projectId, hooks)
  // console.log(r2)
}

const mainGroupName = process.argv[2]
const groups = await fetch('/groups', {
  "method": "GET"
})
const mainGroup = groups.find(row => row.full_path === mainGroupName)
const mainGroupId = mainGroup.id

const projects = await findAllProjectsFromGroup(mainGroupId)
console.log('Found all projects (total: %o, ids: %o)', projects.length, projects.map(row => row.path_with_namespace).join(', '))

let jobs = []
for (const project of projects) {
  jobs.push(syncHooksToProject(project.id, config.get('hooks') ?? []))
}
await Promise.all(jobs)
