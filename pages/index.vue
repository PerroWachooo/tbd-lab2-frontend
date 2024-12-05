<template>
	<div class="background">
		<v-card
			class="mx-auto pa-12 pb-8 mt-16 position-relative"
			elevation="8"
			max-width="448"
			rounded="lg"
			color="var(--primary-a0)"
		>
			<div class="text-center my-8">
				<v-card flat class="elevation-6 pa-4" color="var(--surface-a40)" max-width="500">
					<v-card-title class="text-h4 font-weight-bold text-uppercase">
						Login
						<svg-icon class="large-icon" type="mdi" :path="path"></svg-icon>
					</v-card-title>
				</v-card>
			</div>

			<div class="text-subtitle-1 text-medium-emphasis">Cuenta</div>

			<!-- Inicio del Formulario -->
			<form @submit.prevent="logueo">
				<v-text-field
					v-model="email"
					density="compact"
					placeholder="ejemplo@correo.com"
					prepend-inner-icon="mdi-email-outline"
					color="green"
					variant="outlined"
					@keyup.enter="logueo"
				></v-text-field>

				<div
					class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
				>
					Contraseña
				</div>

				<v-text-field
					v-model="password"
					:append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
					:type="visible ? 'text' : 'password'"
					density="compact"
					placeholder="Ingresa la contraseña"
					color="green"
					prepend-inner-icon="mdi-lock-outline"
					variant="outlined"
					@click:append-inner="visible = !visible"
					@keyup.enter="logueo"
				></v-text-field>

				<v-card class="mb-12" color="surface-variant" variant="tonal">
					<v-card-text class="text-medium-emphasis text-caption">
						Recuerda: Tienes que registrarte primero antes de usar la aplicación
					</v-card-text>
				</v-card>

				<!-- Botón de Ingreso -->
				<v-btn
					class="mb-8"
					color="#f0f0f0"
					size="large"
					variant="outlined"
					block
					type="submit"
				>
					Ingresar
				</v-btn>
			</form>
			<!-- Fin del Formulario -->

			<v-card-text class="text-center">
				<nuxt-link
					class="register text-darken-1 text-decoration-none custom-text-color"
					to="/registro"
					rel="noopener noreferrer"
				>
					Registrate ahora <v-icon icon="mdi-chevron-right"></v-icon>
				</nuxt-link>
			</v-card-text>

			<!-- Mostrar Mensaje de Error -->
			<div v-if="errorMessage" class="error-message">
				{{ errorMessage }}
			</div>
		</v-card>
	</div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccountCircleOutline } from "@mdi/js";
import { useAuthService } from "~/services/authService";

export default {
	name: "my-component",
	components: {
		SvgIcon,
	},
	data() {
		return {
			visible: false,
			path: mdiAccountCircleOutline,
			email: "",
			password: "",
			errorMessage: "",
		};
	},
	methods: {
		async logueo() {
			try {
				const authService = useAuthService();
				const { access_token, id_usuario } = await authService.authenticate(
					this.email,
					this.password
				);

				localStorage.setItem("accessToken", access_token);
				//localStorage.setItem('refresh_token', refresh_token);
				localStorage.setItem("id_usuario", id_usuario);

				this.$router.push("/clientes");
			} catch (error) {
				this.errorMessage = "Credenciales incorrectas";
			}
		},
	},
};
</script>

<style scoped>
.large-icon {
	margin-top: 1px;
	width: 35px;
	height: 35px;
}
.custom-text-color {
	color: #e29818ff;
}
.background {
	background-color: #fff1d95a;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
.error-message {
	color: red;
	text-align: center;
	margin-top: 10px;
}
</style>
