import Vue from 'vue'
import Router from 'vue-router'
// Containers
import Mainlayout from './containers/Mainlayout'
import Loginlayout from './containers/Loginlayout'

import Login from './views/login'
import Otp from './views/Otp'
import Dashboard from './views/dashboard'


//lib

Vue.use(Router)

var router=[
		{
		  path: '/',
		  redirect: '/home',
		  name: 'home',
		  component: Mainlayout,
		  children: [
			{
			  path: 'home',
			  component: Login
			},
			{
			 path: '/otp',
			 name: 'otp',
			 component: Otp	
			}
		 ]
    },
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Mainlayout,
		 children: [
			{
			  path: '/dashboard',
			  component: Dashboard
			},
		 
		 ]
	}
	
	
		
  ];
  


export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes:router 
})
