<template>
	<div class="app">
		<navbar/>
		 <main class="main">
			<div class="container-fluid">
			  <router-view></router-view>
			</div>
		  </main>
	 </div>
</template>

<script>
import loginnavbarWidget from '../components/Loginnavbar'
export default {
  name: 'login-layout',
  components: {
		navbar:loginnavbarWidget,
   
  },
  data(){
		return {
		
			count: 0
			
		}
		}
  
 
 
}
</script>
