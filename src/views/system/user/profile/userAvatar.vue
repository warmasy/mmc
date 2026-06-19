<<template>
  <div class="user-info-head">
    <img :src="userStore.avatar" class="img-circle img-lg" />
  </div>
</template>

<script setup>
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();
</script>

<style lang='scss' scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
</style>