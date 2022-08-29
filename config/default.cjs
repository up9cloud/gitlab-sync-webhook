module.exports = {
  token: '', // the gitlab token, see 
  // universal hooks for every repository
  hooks: [
    // see https://docs.gitlab.com/ee/api/projects.html#add-project-hook, e.q.
    // {
    //   url: 'https://example.com/generic-webhook-trigger/invoke?token=all',
    //   token: 'ffff0000ffff0000ffff0000ffff0000',
    //   push_events: true,
    //   enable_ssl_verification: true,
    // }
  ],
}
