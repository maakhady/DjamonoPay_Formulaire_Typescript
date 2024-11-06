import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

   // Validation des caractères spéciaux et espaces
   nameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Laisse Validators.required gérer le cas vide
    }

    // Vérifie si la valeur ne contient que des espaces ou a moins de 2 caractères non-espaces
    const trimmedValue = control.value.trim();
    if (trimmedValue.length === 0) {
      return { whitespace: true };
    }

    if (trimmedValue.length < 2) {
      return { minlength: true };
    }

    // Vérifie les caractères spéciaux (uniquement lettres, espaces et apostrophes autorisés)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s']*$/;
    if (!nameRegex.test(control.value)) {
      return { specialCharacters: true };
    }

    // Vérifie s'il y a des espaces consécutifs
    if (/\s\s+/.test(control.value)) {
      return { consecutiveSpaces: true };
    }

    return null;
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    // Si vide, laisse Validators.required gérer
    if (!control.value) {
        return null;
    }

    const email = control.value.toLowerCase();

    // Première vérification : présence d'espaces
    if (/\s/.test(email)) {
        return { containsSpaces: true };
    }

    // Vérifie la présence du @
    if (!email.includes('@')) {
        return { invalidFormat: true };
    }

    const [localPart, domain] = email.split('@');

    // Vérifie les points
    if (email.includes('..')) {
        return { consecutiveDots: true };
    }

    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return { dotAtBoundary: true };
    }

    // Vérifie le domaine et son point
    if (!domain || !domain.includes('.')) {
        return { noDomainDot: true };
    }

    // Vérifie le format global avec regex en dernier
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { invalidFormat: true };
    }

    return null;
}

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), this.nameValidator ]],
      lastName: ['', [Validators.required, Validators.minLength(2), this.nameValidator ]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      ]]
    });
  }

  ngOnInit() {
    // Écouter les changements sur tous les champs
    this.loginForm.valueChanges.subscribe(() => {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control && !control.touched) {
          control.markAsTouched();
        }
      });
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Nettoyage des espaces avant soumission
  onSubmit() {
    if (this.loginForm.valid) {
      const formValues = { ...this.loginForm.value };
      // Nettoie les espaces au début et à la fin
      formValues.firstName = formValues.firstName.trim().replace(/\s+/g, ' ');
      formValues.lastName = formValues.lastName.trim().replace(/\s+/g, ' ');
      
      console.log(formValues);
      // Ajoutez votre logique de soumission ici
    }
  }
}