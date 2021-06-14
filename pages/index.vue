<template>
    <div class="live-chat">
        <div class="chat-wrp">
            <div class="chat-header w-full">
                <div class="title w-full p-2 bg-red-500 text-white font-medium flex items-center justify-between">
                    <span>Chat Room - Trực tiếp HD</span>
                    <div v-if="userLogin" class="text-yellow-300 flex items-center">
                        <span class="w-3 h-3 bg-yellow-500 animate-pulse rounded-full mr-2"></span>
                            {{ userLogin }}
                    </div>
                    <div v-if="!userLogin && totalUser" class="text-yellow-300 flex items-center">
                        <span class="w-3 h-3 bg-yellow-500 animate-pulse rounded-full mr-2"></span>
                        {{ totalUser + ' online' }}
                    </div>
                </div>
                <div class="notification w-full flex items-center flex-col bg-red-600 p-2">
                    <marquee behavior="" direction="left" class="text-white">Đăng ký hôm nay nhận ưu đãi đặc biệt</marquee>
                </div>
            </div>
            <div class="chat-content p-2 flex flex-col space-y-2 overflow-y-scroll relative">
                <template v-if="listChat.length">
                    <ChatItem v-for="item in listChat" :key="item.id" :chat="item" />
                    <div v-if="someoneTyping" class="p-1 text-xs text-gray-800 italic w-full flex items-center">
                        <span class="mr-1">{{ someoneTyping + ' '}}</span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        </div>
                </template>
            </div>

            <div v-if="isAuth" class="chat-bottom w-full border-t-2 border-red-500 h-[40px] flex items-center shadow">
                <div class="txt-area w-4/5 h-full flex items-center justify-center p-2">
                    <input
                        class="w-full p-1 rounded outline-none focus:outline-none bg-transparent"
                        type="text"
                        placeholder="Gửi thảo luận"
                        v-model="chat"
                        @keyup="onKeyUpChat"
                    />
                </div>
                <div class="chat-btn w-1/5 h-full flex items-center justify-center">
                    <button class="chat-send outline-none focus:outline-none" @click="sendChat">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 transform rotate-[30deg] text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div v-else class="chat-bottom w-full border-t-2 border-red-500 h-[40px] flex items-center justify-center shadow">
                <span class="text-red-500 font-medium">Vui lòng đăng nhập để thảo luận</span>
            </div>
        </div>
    </div>
</template>

<script>
import CommingChatSound from '~/assets/sound/Facebook_Chat.mp3'
import sendChatSound from '~/assets/sound/Send_Chat.mp3'
export default {
    data () {
        return {
            userLogin: null,
            me: false,
            listChat: [],
            isAuth: false,
            chat: '',
            typingTimeOut: null,
            someoneTyping: null,
            sendChatSound,
            CommingChatSound,
            userNumber: null,
            userLoginTimeOut: null
        }
    },
    computed: {
        userWelcome () {
            if (this.me) {
                if (this.userLogin) {
                    const html = `
                        <span class="mr-2">Xin chào</span>
                        <span class="font-bold text-yellow-500">${this.userLogin}</span>
                    `
                    return html;
                }
            } else {
                if (this.userLogin) {
                    const html = `
                        <span class="font-bold text-yellow-500 mr-2">${this.userLogin}</span>
                        <span> vừa online</span>
                    `
                    return html;
                }
                return '';
            }
        },
        totalUser () {
            return this.getRndInteger(1000, 2035);
        }
    },
    watch: {
        listChat (val) {
            let chatContent = document.querySelector('.chat-content');
            if (chatContent) {
                setTimeout(() => {
                    chatContent.scrollTop = chatContent.scrollHeight
                }, 300)
            };
        },
        userLogin (val) {
            if (val) {
                this.userLoginTimeOut = setTimeout(() => {
                    this.userLogin = null;
                }, 3000)
            }
        }
    },
    mounted () {

        this.socket = this.$nuxtSocket({
            name: 'main'
        });
        this.socket.on('SERVER_SEND_LIST_CHAT', (data) => {
            if (data.length) {
                this.listChat = data
            }
        });
        this.socket.on('SERVER_SEND_CHECK_AUTH', (isAuth) => {
            this.isAuth = isAuth
        });
        this.socket.on('USER_LOGGING_IN', (username) => {
            if (this.userLoginTimeOut) clearTimeout(this.userLoginTimeOut);
            this.userLogin = username;
        });

        this.socket.on('SOMEONE_TYPING', (someone) => {
            this.someoneTyping = someone
        });

        this.socket.on('SERVER_UPDATE_CHAT', (chat) => {
            this.listChat = [...this.listChat, chat];
        });
        this.socket.on('PLAY_COMING_MESSAGE_SOUND', () => {
            this.playSound(CommingChatSound);
        })
        this.socket.emit('USER_ENTRANCE');

        window.addEventListener('message', (event) => {
            if (event.data.msg) {
                this.socket.emit('USER_LOGIN', event.data.token);
            }
        })

    },
    methods: {
        onKeyUpChat (e) {
            clearInterval(this.typingTimeOut);
            this.typingTimeOut = setTimeout(() => {
                this.socket.emit('USER_TYPING', false);
            }, 2000)
            this.socket.emit('USER_TYPING', true);

            if (e.keyCode === 13) {
                if (this.chat === '') return false;

                this.socket.emit('USER_SEND_CHAT', this.chat);
                this.playSound(sendChatSound);

                this.chat = '';

                this.socket.emit('USER_TYPING', false);
            }
        },
        sendChat () {
            if (this.chat === '') return false;
            this.socket.emit('USER_SEND_CHAT', this.chat);
            this.playSound(sendChatSound);
            this.chat = '';
            this.socket.emit('USER_TYPING', false);
        },
        playSound (sound) {
            const audio = new Audio(sound);
            audio.play()
        },
        getRndInteger (min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
    }
};
</script>

<style lang="postcss">
.live-chat {
  @apply flex items-center justify-center h-[100vh] w-full overflow-hidden;
  & .chat-wrp {
    @apply w-full h-full;
  }
}
.chat-content {
  height: calc(100vh - 80px - 40px);
}
.chat-item-meta:before {
  position: absolute;
  bottom: 0;
  left: -9px;
  content: '';
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid  #fecaca;
}
.dot {
    @apply bg-gray-700;
    display:inline-block;
    width:3px;
    height:3px;
    border-radius:50%;
    margin-right:5px;
    animation: wave 1.3s linear infinite;

    &:nth-child(2) {
        animation-delay: -1.1s;
    }

    &:nth-child(3) {
        animation-delay: -0.9s;
    }
}
@keyframes wave {
	0%, 60%, 100% {
		transform: initial;
	}

	30% {
		transform: translateY(-6px);
	}
}
</style>
