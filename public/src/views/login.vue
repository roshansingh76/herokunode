<template>
  <div class="app  align-items-center" style="margin-top:20px;">
   <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group">
            <div class="card p-4">
			<b-form @submit="onSubmit" @reset="onReset" v-if="show">
				<b-form-group id="exampleInputGroup1"
				label="Mobile Number:"
				label-for="exampleInput1"
				description="We'll never share your mobile with anyone else.">
					<b-form-input id="exampleInput1"
					  type="text"
					  v-model="form.mobile"
					  required
					  placeholder="Enter Mobile">
					</b-form-input>
				</b-form-group>
				<b-button type="submit" variant="primary">Next</b-button>
				<b-button type="reset" variant="danger">Reset</b-button>
			</b-form>

			</div>
           </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        mobile: '',
       
      },
     
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
			NProgress.start();
			$.post('https:/rgyan.com/api/checkLogin',{
				mobile: this.mobile,
				
			})
			.then(response => {
					
				this.$router.push('/otp');
			}).catch(error => {
				console.log(error);
			})
      //alert(JSON.stringify(this.form));
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.mobile = '';
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>
