const githubAPI = require("../../api/github");

module.exports.getRepoOwner = async function(provider, repo) {
  let all_repos = await this.getRepos(provider)
  let repo_owner = null
  for (let i = 0; i < all_repos.length; i++) {
    if (all_repos[i].name == repo) {
      repo_owner = all_repos[i].owner.login
      break
    }
  }
  if (repo_owner == null)
    return {error: true, message: "Invalid repo name !", all_repos};
  return repo_owner
}

module.exports.getRepos = async function(provider) {
    console.log("github service user repos,", provider.scope);
    let profile = JSON.parse(provider.profile)
    if (provider.scope === 'GITHUB') {
      try {
        const { data } = await githubAPI.api.get(`/user/repos`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          },
          params: {
            visibility: "all"
          },
          auth: {
                username: profile["username"],
                password: await provider.getAccessToken()
              }
          });
        return data;
      } catch (err) {
        return {
          error: true,
          message: "Can't get repos",
          err
        };
      }
    } else {
      return {error: true, message: "Invalid Scope !"};
    }
  };

module.exports.createIssue = async function(provider, owner, repo, query) {
  console.log("github service create issus,", provider.scope, owner, repo, query);
  let repo_owner = owner
  if (repo_owner == null) {
    repo_owner = await this.getRepoOwner(provider, repo)
    if (repo_owner.error)
      return {error: true, message: "Invalid repo name !", all_repos};
  }
  let profile = JSON.parse(provider.profile)
  if (provider.scope === 'GITHUB') {
    try {
      let body = JSON.stringify(query)
      const { data } = await githubAPI.api.post(`/repos/${repo_owner}/${repo}/issues`,
        body,
        {
          auth: {
              username: profile["username"],
              password: await provider.getAccessToken()
            }
          });
      return data;
    } catch (err) {
      return {
        error: true,
        message: "Can't post issues",
        err,
      };
    }
  } else {
    return {error: true, message: "Invalid Scope !"};
  }
};

module.exports.getPulls = async function(provider) {
  console.log("github service get pulls,", provider.scope);
  let all_repos = await this.getRepos(provider)
  let ret = [];
  for (let i = 0; i < all_repos.length; i++) {
    ret.push(this.getPullsRepo(provider, all_repos[i].name, all_repos[i].owner.login)
      .then(repo => ({i, repo}))
      .catch(err => console.log(err)));
  }
  let data = await Promise.all(ret).then((repo) => {
    return repo
    .filter(it => it.error != true)
    .filter(it => it.repo.length > 0)
    .map(repo => {
      return {repo: all_repos[repo.i].name, owner: all_repos[repo.i].owner.login, pullRequest: repo.repo}
    })
  });
  return data
};

module.exports.getPullsRepo = async function(provider, repo, owner) {
  console.log("github service get pulls repo,", provider.scope, repo, owner);
  let profile = JSON.parse(provider.profile)
  if (provider.scope === 'GITHUB') {
    try {
      const { data } = await githubAPI.api.get(`/repos/${owner}/${repo}/pulls`,
        {
          params: {
            state: "open"
          },
          auth: {
              username: profile["username"],
              password: await provider.getAccessToken()
            }
          });
      return data;
    } catch (err) {
      return {
        error: true,
        message: "Can't get pulls",
        err,
      };
    }
  } else {
    return {error: true, message: "Invalid Scope !"};
  }
};

module.exports.createTagRef = async function(provider, sha, owner, repo, query) {
  console.log("github service create tag ref,", provider.scope, owner, repo, query, sha);
  let profile = JSON.parse(provider.profile)
  if (provider.scope === 'GITHUB') {
    try {
      query = JSON.parse(query)
      let body = JSON.stringify({
        ref: `refs/tags/${query.tag}`,
        sha: sha
      })
      const { data } = await githubAPI.api.post(`/repos/${owner}/${repo}/git/refs`,
        body,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          },
          auth: {
              username: profile["username"],
              password: await provider.getAccessToken()
            }
          });
      return data;
    } catch (err) {
      return {
        error: true,
        message: "Can't post tag refs",
        err,
      };
    }
  } else {
      return {error: true, message: "Invalid Scope !"};
    }
}

module.exports.createTag = async function(provider, owner, repo, query) {
  console.log("github service create tag,", provider.scope, owner, repo, query);
  let repo_owner = owner
  if (repo_owner == null) {
    repo_owner = await this.getRepoOwner(provider, repo)
    if (repo_owner.error)
      return {error: true, message: "Invalid repo name !", all_repos};
  }
  let profile = JSON.parse(provider.profile)
  if (provider.scope === 'GITHUB') {
    try {
      let body = JSON.stringify(Object.assign({
        tag: "",
        message: "",
        type: "commit"
      }, query))
      const { data } = await githubAPI.api.post(`/repos/${repo_owner}/${repo}/git/tags`,
        body,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          },
          auth: {
              username: profile["username"],
              password: await provider.getAccessToken()
            }
          });
      return await this.createTagRef(provider, data.sha, repo_owner, repo, body);
    } catch (err) {
      return {
        error: true,
        message: "Can't post tag",
        err,
      };
    }
  } else {
    return {error: true, message: "Invalid Scope !"};
  }
};

module.exports.getCommits = async function(provider, owner, repo) {
  console.log("github service get commits,", provider.scope, owner, repo);
  let repo_owner = owner
  if (repo_owner == null) {
    repo_owner = await this.getRepoOwner(provider, repo)
    if (repo_owner.error)
      return {error: true, message: "Invalid repo name !", all_repos};
  }
  let profile = JSON.parse(provider.profile)
  if (provider.scope === 'GITHUB') {
    try {
      const { data } = await githubAPI.api.get(`/repos/${repo_owner}/${repo}/commits`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          },
          auth: {
              username: profile["username"],
              password: await provider.getAccessToken()
            }
          });
      return data
    } catch (err) {
      return {
        error: true,
        message: "Can't get commits",
        err,
      };
    }
  } else {
    return {error: true, message: "Invalid Scope !"};
  }
};