<template>
	<div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
	  <h5 class="my-0 mr-md-auto font-weight-normal"><img :src="image_src" style="width:123px;height:33px;">

		</h5>
	  <nav class="my-2 my-md-0 mr-md-3">
	   
	  </nav>
	  <a class="btn btn-outline-primary" href="#">Logout</a>
    </div>
</template>

<script>

export default {
 data: function () {
  return {
    count: 0,
	image_src:'src/assets/rgyanlogo.png',
	
  }
}
}
</script>