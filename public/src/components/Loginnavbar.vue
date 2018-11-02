<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<a class="navbar-brand" href="#"><img :src="image_src" style="width:123px;height:33px;"></a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>
	</nav>
</template>
<script>

export default {
  name: 'login-navbar',
  data: function () {
	  return {
		count: 0,
		image_src:'src/assets/rgyanlogo.png',
	  }
	}
 }
</script>
