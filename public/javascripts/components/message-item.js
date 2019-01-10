Vue.component('message-item', {
  template: '#message-item-template',
  props: [ 'message', 'now' ],
  computed: {
    humanCreatedAt,
    identicon
  },
  methods: {
    remove
  }
});

function humanCreatedAt() {
  return moment(this.message.createdAt).from(moment.max(moment(this.now), moment(this.message.createdAt)));
}

function identicon() {
  return typeof jdenticon !== undefined ? jdenticon.toSvg(this.message.author, 80): '';
}

async function remove() {

  const res = await fetch(`/api/messages/${this.message.id}`, {
    method: 'DELETE'
  });

  if (res.status === 204) {
    this.$emit('deleted', this.message);
  }
}
