const app = new Vue({
  el: '#app',
  template: '#app-template',
  created,
  mounted,
  beforeDestroy,
  data: {
    messageAuthor: new Chance().name(),
    messageContents: '',
    messages: [],
    now: new Date(),
    nowInterval: null,
    socket: null,
    status: 'connecting'
  },
  computed: {
    errors
  },
  methods: {
    connect,
    disconnect,
    hasErrors,
    onMessageCreated,
    onMessageRemoved,
    onSocketConnect,
    onSocketDisconnect,
    onSocketReconnecting,
    submitMessage
  }
});

function beforeDestroy() {
  clearInterval(this.nowInterval);
  this.socket.off();
}

function connect() {
  this.socket.connect();
}

function created() {
  this.socket = io();
  this.socket.on('connect', this.onSocketConnect.bind(this));
  this.socket.on('reconnecting', this.onSocketReconnecting.bind(this));
  this.socket.on('disconnect', this.onSocketDisconnect.bind(this));
  this.socket.on('message:created', this.onMessageCreated.bind(this));
  this.nowInterval = setInterval(() => this.now = new Date(), 1000);
}

function disconnect() {
  this.socket.close();
}

function errors() {

  const errors = {
    author: {},
    contents: {}
  };

  if (!this.messageAuthor || this.messageAuthor.match(/^\s+$/)) {
    errors.author.blank = true;
  } else if (this.messageAuthor.length < 2) {
    errors.author.tooShort = true;
  } else if (this.messageAuthor.length > 25) {
    errors.author.tooLong = true;
  }

  if (!this.messageContents || this.messageContents.match(/^\s+$/)) {
    errors.contents.blank = true;
  } else if (this.messageContents.length < 1) {
    errors.contents.tooShort = true;
  } else if (this.messageContents.length > 250) {
    errors.contents.tooLong = true;
  }

  return errors;
}

function hasErrors(field) {
  return field ? !_.isEmpty(this.errors[field]) : _.some(this.errors, (value, key) => !_.isEmpty(value));
}

function mounted() {
  this.$refs.messageContentsInput.focus();
}

function onMessageCreated(message) {
  this.messages = [ message, ...this.messages ].slice(0, 100);
}

function onMessageRemoved(message) {
  this.messages = _.without(this.messages, message);
}

async function onSocketConnect() {

  this.status = 'connected';

  // Fetch latest messages
  const recentMessages = await fetchJson('/api/messages');

  // Filter out already displayed messages
  const newMessages = _.differenceBy(recentMessages, this.messages, _.property('id'));

  // Add new messages and sort from newest to oldest
  this.messages = _.sortBy([ ...this.messages, ...newMessages ], message => -moment(message.createdAt).unix()).slice(0, 100);
}

function onSocketDisconnect() {
  this.status = 'disconnected';
}

function onSocketReconnecting() {
  this.status = 'connecting';
}

async function submitMessage(event) {
  event.preventDefault();

  if (this.hasErrors() || this.status !== 'connected') {
    return;
  }

  const body = JSON.stringify({
    author: this.messageAuthor,
    contents: this.messageContents
  });

  this.messageContents = '';
  this.$refs.messageContentsInput.focus();

  await fetchJson('/api/messages', {
    method: 'POST',
    body
  });
}

async function fetchJson(url, options = {}) {

  const defaultHeaders = {};
  if (options.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  });

  return res.json();
}
