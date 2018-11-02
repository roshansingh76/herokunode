<template>
 <div class="app  align-items-center" style="margin-top:20px;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group">
            <div class="card p-4">
				<h1><center>Sign in</center></h1>
				<p><center>Enter your mobile number to create account</center></p>
				<div class="input-group mb-3">
				 <input type="text" class="form-control" v-model="otp" aria-label="Enter OTP">
				</div>

				 <div class="row">
                  <div class="col-12">
                    <button type="button" class="btn btn-primary px-4" @click.prevent="checkotp">Validate OTP</button>
										
					 <button type="button" class="btn btn-primary px-4" @click.prevent="back">Back</button>					

                  </div>
                  
                </div>
				
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
		methods: {
			checkotp(){
				 NProgress.start();
				$.post('https://rgyan.com//api/otp',{
					mobile: this.otp,
					
				})
				.then(response => {
					 NProgress.done();
					this.$router.push('/dashboard');
				}).catch(error => {
					console.log(error);
				})
			},
			back(){
				 NProgress.done();
				this.$router.push('/');
			}
		},
		data(){
			return {
				otp: "",
				count: 0
				
			}
		}
	}
</script>
