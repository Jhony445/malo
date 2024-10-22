import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Importa Router y NavigationEnd
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'; // Importamos el operador 'filter'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  profileMenuOpen = false;
  isAuthenticated = false;
  user = { email: '' };
  private authSubscription: Subscription;
  private routerSubscription: Subscription;

  constructor(private userService: UserService, private router: Router) {
    // Suscripción a cambios de autenticación
    this.authSubscription = this.userService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        const userData = this.userService.getUserData();
        if (userData) {
          this.user.email = userData.email;
        }
      } else {
        this.user = { email: '' };
      }
    });

    // Detectamos cambio de ruta
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.closeMenu(), 0); // Cierra el menú en cada cambio de ruta
    });
  }

  isOnProfilePage(): boolean {
    return this.router.url === '/usuario/perfil';
  }

  ngOnInit(): void {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.disableScroll(); // Deshabilitamos el scroll cuando el menú está abierto
    } else {
      this.enableScroll(); // Habilitamos el scroll cuando el menú está cerrado
    }
  }

  closeMenu() {
    if (this.menuOpen) {
      this.menuOpen = false;
      this.enableScroll(); // Aseguramos que el scroll se restaure al cerrar el menú
    }
  }

  disableScroll() {
    document.body.classList.add('no-scroll');
    document.addEventListener('touchmove', this.preventScroll, { passive: false });
    document.addEventListener('wheel', this.preventScroll, { passive: false });
  }
  
  enableScroll() {
    document.body.classList.remove('no-scroll');
    document.removeEventListener('touchmove', this.preventScroll);
    document.removeEventListener('wheel', this.preventScroll);
  }

  preventScroll(event: Event) {
    event.preventDefault();
  }

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const profileMenu = document.querySelector('.profile-menu');
    if (this.profileMenuOpen && profileMenu && !profileMenu.contains(target) && !target.closest('#perfil')) {
      this.closeProfileMenu();
    }
  }

  logout(): void {
    this.userService.clearToken();
    this.isAuthenticated = false;
    this.user = { email: '' };
    this.profileMenuOpen = false;
    this.enableScroll(); // Restauramos el scroll al hacer logout
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.routerSubscription.unsubscribe(); // Desuscribimos de los eventos del router
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  
}
