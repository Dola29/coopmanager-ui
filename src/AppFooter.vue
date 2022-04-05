<template>
	<div class="layout-footer">
		<a href="https://github.com/Dola29">
			<span class="font-medium ml-2">@Dola29</span>
		</a>
	</div>
</template>

<script>
	export default {
		name: "AppFooter",
		methods: {
			footerImage() {
				return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
			}
		},
		computed: {
			darkTheme() {
				return this.$appState.darkTheme;
			}
		}
	}
</script>