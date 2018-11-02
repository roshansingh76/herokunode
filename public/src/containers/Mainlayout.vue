<template>
	<div class="app">
		<dheader/>
		 <main class="main">
			<div class="container">
			  <router-view></router-view>
			</div>
		  </main>
		 <dfooter/>
	 </div>
</template>

<script>
import DashboardheaderWidget from '../components/Dashboardheader'
import DashboardfooterWidget from '../components/Dashboardfooter'

export default {
  name: 'Mainlayout',
  components: {
   dheader:DashboardheaderWidget,
   dfooter:DashboardfooterWidget
   
  },
  data: function () {
  return {
    count: 0
  }
},
  computed: {
   
  }
}
</script>
