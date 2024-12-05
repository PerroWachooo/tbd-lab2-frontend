<template>
	<div class="background">
		<v-card
			class="mx-auto pa-12 pb-8 mt-16 position-relative"
			elevation="8"
			max-width="448"
			min-height="448"
			rounded="lg"
			color=""
		>
			<div class="text-center my-8">
				<v-card flat class="elevation-6 pa-4" color="#FAE5C4ff" max-width="500">
					<v-card-title class="text-h4 font-weight-bold text-uppercase">
						Register
					</v-card-title>
					<svg-icon type="mdi" :path="path"></svg-icon>
				</v-card>
			</div>

			<div class="text-subtitle-1 text-medium-emphasis">Nombre</div>

			<v-text-field
				v-model="name"
				density="compact"
				placeholder="Nombre"
				prepend-inner-icon="mdi-account-outline"
				variant="outlined"
			></v-text-field>

			<div class="text-subtitle-1 text-medium-emphasis">Correo</div>

			<v-text-field
				v-model="email"
				density="compact"
				placeholder="ejemplo@correo.com"
				prepend-inner-icon="mdi-email-outline"
				variant="outlined"
			></v-text-field>

			<div class="text-subtitle-1 text-medium-emphasis">Teléfono</div>
			<v-text-field
				v-model="phone"
				density="compact"
				placeholder="912345678"
				prepend-inner-icon="mdi-phone-outline"
				variant="outlined"
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
				hint="La contraseña debe tener al menos 8 caracteres, 4 letras y 4 números"
				prepend-inner-icon="mdi-lock-outline"
				variant="outlined"
				@click:append-inner="visible = !visible"
			></v-text-field>

			<div
				class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
			>
				Confirma contraseña
			</div>

			<v-text-field
				v-model="confirmPassword"
				:append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="visible ? 'text' : 'password'"
				density="compact"
				placeholder="Ingresa nuevamente la contraseña"
				hint="Las contraseñas tinen que ser iguales"
				prepend-inner-icon="mdi-lock-outline"
				variant="outlined"
				@click:append-inner="visible = !visible"
			></v-text-field>

			<v-card class="mb-12 custom-text-color" variant="tonal">
				<v-card-text class="text-medium-emphasis text-caption">
					Recuerda: Elige una contrseña segura y que puedas recordar
				</v-card-text>
			</v-card>

			<v-btn
				class="mb-8"
				color="#e29818ff"
				size="large"
				variant="tonal"
				block
				@click="register"
			>
				Registrarme
			</v-btn>

			<v-alert v-if="errorMessage" type="error" class="mt-4">
				{{ errorMessage }}
			</v-alert>
		</v-card>
	</div>
</template>

<style scoped>
.custom-text-color {
	color: rgb(215, 170, 21);
}
.background {
	background-color: #fff1d95a;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

<script>
import { useUsuarioService } from "@/services/usuarioService";

export default {
	name: "loginView",
	data() {
		return {
			visible: false,
			name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
			errorMessage: "",
		};
	},
	methods: {
		async register() {
			if (this.password !== this.confirmPassword) {
				this.errorMessage = "Las contraseñas no coinciden";
				return;
			}
			if (this.password.length < 8) {
				this.errorMessage = "La contraseña debe tener al menos 8 caracteres";
				return;
			}
			try {
				const newUser = {
					nombre: this.name,
					email: this.email,
					telefono: this.phone,
					contrasena: this.password,
				};
				const usuarioService = useUsuarioService();
				console.log(newUser);
				await usuarioService.createUsuario(newUser);
				this.$router.push("/");
			} catch (error) {
				this.errorMessage = "Error al registrar el usuario";
			}
		},
	},
};
</script>
