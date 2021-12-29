const HOST_NAME = 'http://localhost:8080'

const GOOGLE = {
  clientID: "355529815430-j7djcesqpeneqt217osfeh8q9p2dsd61.apps.googleusercontent.com",
  clientSecret: "XIyqudhZnnY0kQko3prrJH6D",
  callbackURL: `${HOST_NAME}/auth/google/callback`
}

const FACEBOOK = {
  clientID: '503010117746036',
  clientSecret: '69e603047a60d2f91414c629ecfb8fc8',
  callbackURL: `${HOST_NAME}/auth/facebook/callback`,
}

const GITHUB = {
  clientID: '9da8f31dc69375b808dd',
  clientSecret: '93a17865375b354c9df4e35d8a950751c302b8b1',
  callbackUrl: `${HOST_NAME}/auth/github/callback`
}

const TWITTER = {
  clientID: 'hYHjCfvuOAWOol5HZGY2Syx5V',
  clientSecret: 'SPEgzjQXNAlBmXzPHGQOLxSpy9vjRVkq7tsCLVm6cIzcRT9bpW',
  callbackUrl: `${HOST_NAME}/auth/twitter/callback`
}

module.exports = {
  secret: process.env.JWT_SECRET,
  tokenLife: 60*60*24,
  GOOGLE,
  FACEBOOK,
  GITHUB,
  TWITTER,
}