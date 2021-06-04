<template>
    <div class="chat-item flex py-2 w-full space-x-2 items-end">
            <div v-if="chat.user_avatar" class="avatar w-[40px] h-[40px] rounded-full bg-green-700 items-center justify-center bg-cover bg-center bg-no-repeat" :style="`background-image: url('${chat.user_avatar}')`"></div>
            <div v-else class="avatar w-[40px] h-[40px] rounded-full bg-green-700 text-white text-2xl font-semibold flex items-center justify-center">
                {{ chat.username.charAt(0).toUpperCase() }}
            </div>
            <div class="chat-item-meta w-[85%] flex flex-col p-2 rounded bg-red-200 relative">
                <div class="meta-head w-full flex">
                    <div class="name text-sm font-medium mr-2">
                        {{ chat.username }}
                    </div>
                    <div class="time text-sm italic text-gray-500">
                        {{ sendTime }}
                    </div>
                </div>
                <div class="meta-content">
                    <span class="text-gray-800 font-medium text-sm">
                        {{ chat.message }}
                    </span>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    props: {
        chat: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        sendTime () {
            const date = new Date(this.chat.created_at);
            const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            return hours + ':' + minutes;
        }
    }
}
</script>

<style>

</style>
