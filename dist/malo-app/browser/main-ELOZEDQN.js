import{b as X,c as W,d as J,e as b,f as K,g as Q,h as Y,i as v,j as M}from"./chunk-UTESEXKU.js";import{k as G,m as H,p}from"./chunk-ABQQSZUZ.js";import{$a as V,Ja as O,Ma as h,Na as j,Oa as e,Pa as t,Qa as a,Ra as U,Sa as A,Ta as B,Wa as C,Xa as _,Z as l,Za as n,_a as q,fb as c,ga as T,ha as R,hb as $,x as L,xa as m,ya as x}from"./chunk-T5QHMN5N.js";var P=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-footer"]],standalone:!0,features:[c],decls:14,vars:0,consts:[[1,"footer"],[1,"container"],[1,"footer-links"],["href","#"]],template:function(o,s){o&1&&(e(0,"footer",0)(1,"div",1)(2,"p"),n(3,"Manos a la obra"),t(),e(4,"ul",2)(5,"li")(6,"a",3),n(7,"Pol\xEDtica de privacidad"),t()(),e(8,"li")(9,"a",3),n(10,"T\xE9rminos de servicio"),t()(),e(11,"li")(12,"a",3),n(13,"Contacto"),t()()()()())},styles:[".footer[_ngcontent-%COMP%]{background-color:#090c9b;color:#fff;padding:1em 0;text-align:center;width:100%;position:relative;margin-top:auto}.footer[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;max-width:1200px;margin:0 auto;padding:0 20px}.footer-links[_ngcontent-%COMP%]{list-style:none;padding:0;margin:0}.footer-links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:inline;margin-right:15px}.footer-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;text-decoration:none}@media (max-width: 768px){.footer[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{flex-direction:column;text-align:center}.footer-links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:block;margin:10px 0}}"]})};var S=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-root"]],standalone:!0,features:[c],decls:2,vars:0,template:function(o,s){o&1&&a(0,"router-outlet")(1,"app-footer")},dependencies:[b,P,p],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;min-height:100vh}"]})};var y=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-nosotros"]],standalone:!0,features:[c],decls:9,vars:0,consts:[[1,"nosotros-section"]],template:function(o,s){o&1&&(e(0,"div",0)(1,"h2"),n(2,"Sobre Nosotros"),t(),e(3,"p"),n(4," Somos una plataforma dedicada a conectar a los mejores talentos con empresas seguras y confiables. "),t(),e(5,"p"),n(6," Nuestro objetivo es ayudarte a encontrar el empleo ideal de manera f\xE1cil y r\xE1pida. "),t(),e(7,"p"),n(8," \xDAnete a nuestra comunidad y descubre las oportunidades que tenemos para ti. "),t()())},styles:[".nosotros-section[_ngcontent-%COMP%]{padding:40px;background-color:#fff;text-align:center}.nosotros-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:28px;color:#090c9b}.nosotros-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:18px;color:#333;max-width:800px;margin:20px auto}"]})};function ie(i,r){if(i&1&&(e(0,"div",10)(1,"p",11),n(2),t()()),i&2){let o=_();m(2),q(o.user.email)}}function re(i,r){i&1&&(U(0),e(1,"li")(2,"a",12),n(3,"Iniciar sesi\xF3n"),t()(),e(4,"li")(5,"a",13),n(6,"Reg\xEDstrate"),t()(),A())}function ae(i,r){i&1&&(e(0,"li")(1,"a",19),n(2,"Empleos"),t()())}function se(i,r){if(i&1){let o=B();U(0),O(1,ae,3,0,"li",9),e(2,"li",14)(3,"a",15),C("click",function(f){T(o);let ne=_();return R(ne.toggleProfileMenu(f))}),n(4,"Perfil"),t(),e(5,"ul",16)(6,"li")(7,"a",17),n(8,"Configuraci\xF3n"),t()(),e(9,"li")(10,"a",18),C("click",function(){T(o);let f=_();return R(f.logout())}),n(11,"Cerrar sesi\xF3n"),t()()()(),A()}if(i&2){let o=_();m(),h("ngIf",o.isOnProfilePage()),m(4),j("active",o.profileMenuOpen)}}var g=class i{constructor(r,o){this.userService=r;this.router=o;this.authSubscription=this.userService.isAuthenticated$.subscribe(s=>{if(this.isAuthenticated=s,s){let f=this.userService.getUserData();f&&(this.user.email=f.email)}else this.user={email:""}}),this.routerSubscription=this.router.events.pipe(L(s=>s instanceof J)).subscribe(()=>{setTimeout(()=>this.closeMenu(),0)})}menuOpen=!1;profileMenuOpen=!1;isAuthenticated=!1;user={email:""};authSubscription;routerSubscription;isOnProfilePage(){return this.router.url==="/usuario/perfil"}ngOnInit(){document.addEventListener("click",this.handleClickOutside.bind(this))}toggleMenu(){this.menuOpen=!this.menuOpen,this.menuOpen?this.disableScroll():this.enableScroll()}closeMenu(){this.menuOpen&&(this.menuOpen=!1,this.enableScroll())}disableScroll(){document.body.classList.add("no-scroll"),document.addEventListener("touchmove",this.preventScroll,{passive:!1}),document.addEventListener("wheel",this.preventScroll,{passive:!1})}enableScroll(){document.body.classList.remove("no-scroll"),document.removeEventListener("touchmove",this.preventScroll),document.removeEventListener("wheel",this.preventScroll)}preventScroll(r){r.preventDefault()}toggleProfileMenu(r){r.stopPropagation(),this.profileMenuOpen=!this.profileMenuOpen}closeProfileMenu(){this.profileMenuOpen=!1}handleClickOutside(r){let o=r.target,s=document.querySelector(".profile-menu");this.profileMenuOpen&&s&&!s.contains(o)&&!o.closest("#perfil")&&this.closeProfileMenu()}logout(){this.userService.clearToken(),this.isAuthenticated=!1,this.user={email:""},this.profileMenuOpen=!1,this.enableScroll()}ngOnDestroy(){this.authSubscription.unsubscribe(),this.routerSubscription.unsubscribe(),document.removeEventListener("click",this.handleClickOutside.bind(this))}static \u0275fac=function(o){return new(o||i)(x(M),x(K))};static \u0275cmp=l({type:i,selectors:[["app-navbar"]],standalone:!0,features:[c],decls:14,vars:5,consts:[["src","logoblanco.png","alt","Logo",1,"logo"],["id","abrir",1,"abrir-menu",3,"click"],[1,"fas","fa-bars"],["id","nav",1,"nav"],["id","cerrar",1,"cerrar-menu",3,"click"],[1,"fas","fa-times"],["class","user-info",4,"ngIf"],[1,"nav-list"],["routerLink","/nosotros"],[4,"ngIf"],[1,"user-info"],[1,"user-email"],["href","/auth/login"],["href","/auth/sign-up"],[1,"dropdown"],["href","usuario/perfil","id","perfil",1,"perfil",3,"click"],[1,"dropdown-content"],["href","usuario/perfil"],["href","#",1,"logout",3,"click"],["routerLink","/usuario"]],template:function(o,s){o&1&&(e(0,"header"),a(1,"img",0),e(2,"button",1),C("click",function(){return s.toggleMenu()}),a(3,"i",2),t(),e(4,"nav",3)(5,"button",4),C("click",function(){return s.toggleMenu()}),a(6,"i",5),t(),O(7,ie,3,1,"div",6),e(8,"ul",7)(9,"li")(10,"a",8),n(11,"Nosotros"),t()(),O(12,re,7,0,"ng-container",9)(13,se,12,3,"ng-container",9),t()()()),o&2&&(m(4),j("visible",s.menuOpen),m(3),h("ngIf",s.isAuthenticated),m(5),h("ngIf",!s.isAuthenticated),m(),h("ngIf",s.isAuthenticated))},dependencies:[v,Q,p,H],styles:['header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:2rem;background-color:#090c9b;height:100px}.logo[_ngcontent-%COMP%]{width:160px;height:auto;cursor:pointer}.nav-list[_ngcontent-%COMP%]{list-style-type:none;display:flex;gap:1rem;align-items:center;transition:transform .3s ease}.nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:inline}.nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;color:#fff;position:relative;font-size:1.1rem;font-weight:700}.nav-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:gold}.nav-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:after{content:"";position:absolute;width:100%;height:2px;background-color:gold;left:0;bottom:0;transform:scaleX(0);transform-origin:bottom right;transition:transform .3s ease-out}.nav-list[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover:after{transform:scaleX(1);transform-origin:bottom left}.abrir-menu[_ngcontent-%COMP%], .cerrar-menu[_ngcontent-%COMP%]{display:none}.abrir-menu[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#fff}.no-scroll[_ngcontent-%COMP%]{overflow:hidden;position:fixed;width:100%;top:0;left:0}@media screen and (max-width: 550px){.abrir-menu[_ngcontent-%COMP%], .cerrar-menu[_ngcontent-%COMP%]{display:block;border:0;font-size:1.25rem;background-color:transparent;cursor:pointer}.abrir-menu[_ngcontent-%COMP%]{color:#f9eded}.cerrar-menu[_ngcontent-%COMP%]{color:#ececec}.nav[_ngcontent-%COMP%]{opacity:0;visibility:hidden;display:flex;flex-direction:column;align-items:flex-start;gap:1rem;position:absolute;top:0;right:0;bottom:0;background-color:#fff;padding:2rem;box-shadow:0 0 0 100vmax #00000080;width:80%;height:min(75vh,90%);border-radius:10px 0 0 10px;z-index:100}.nav.visible[_ngcontent-%COMP%]{opacity:1;visibility:visible}.nav-list[_ngcontent-%COMP%]{flex-direction:column;align-items:flex-start;width:100%;display:flex;flex-grow:1;justify-content:space-between}.nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#000000ec;padding:1rem 0;width:100%;display:block;border-bottom:1px solid #ddd}.nav-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a.logout[_ngcontent-%COMP%]{color:red;font-weight:700;margin-top:auto;margin-bottom:2rem}.cerrar-menu[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#000}.user-info[_ngcontent-%COMP%]{border-bottom:1px solid #ddd;padding-bottom:1rem;width:100%}.user-email[_ngcontent-%COMP%]{font-weight:700;color:#000;font-size:1rem}.user-name[_ngcontent-%COMP%]{color:#666;font-size:.875rem}#perfil[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 551px){.user-info[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 551px){.dropdown-content[_ngcontent-%COMP%]{display:none;position:absolute;background-color:#fff;box-shadow:0 8px 16px #0003;padding:1rem;border-radius:8px;min-width:160px;right:0;z-index:10}.dropdown[_ngcontent-%COMP%]:hover   .dropdown-content[_ngcontent-%COMP%]{display:block}.dropdown-content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style:none;padding:.5rem 0;border-bottom:1px solid #ddd}.dropdown-content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child{border-bottom:none}.dropdown-content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;color:#090c9b;display:block;font-size:1rem;padding:.5rem}.dropdown-content[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#e74c3c}}']})};var E=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-feature-section"]],standalone:!0,features:[c],decls:25,vars:0,consts:[[1,"features-section"],[1,"feature-item"],["src","1.svg","alt","Empresas seguras",1,"feature-icon"],["src","2.svg","alt","100+ Empleos",1,"feature-icon"],["src","3.svg","alt","F\xE1cil de usar",1,"feature-icon"],["src","4.svg","alt","Reg\xEDstrate",1,"feature-icon"],["src","5.svg","alt","Busca",1,"feature-icon"],["src","6.svg","alt","Sin necesidad de estudios",1,"feature-icon"]],template:function(o,s){o&1&&(e(0,"div",0)(1,"div",1),a(2,"img",2),e(3,"p"),n(4,"Empresas seguras"),t()(),e(5,"div",1),a(6,"img",3),e(7,"p"),n(8,"100+ Empleos"),t()(),e(9,"div",1),a(10,"img",4),e(11,"p"),n(12,"F\xE1cil de usar"),t()(),e(13,"div",1),a(14,"img",5),e(15,"p"),n(16,"Reg\xEDstrate"),t()(),e(17,"div",1),a(18,"img",6),e(19,"p"),n(20,"Busca"),t()(),e(21,"div",1),a(22,"img",7),e(23,"p"),n(24,"Sin necesidad de estudios"),t()()())},styles:[".features-section[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:center;padding:50px;background-color:#fff}.feature-item[_ngcontent-%COMP%]{text-align:center;margin:10px;flex:1 0 150px;max-width:200px}.feature-icon[_ngcontent-%COMP%]{width:80px;height:auto;margin-bottom:10px}.feature-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;font-weight:700;color:#090c9b}"]})};var w=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-busqueda"]],standalone:!0,features:[c],decls:15,vars:0,consts:[[1,"carousel-container"],["id","carouselExample","data-bs-ride","carousel",1,"carousel","slide"],[1,"carousel-inner"],[1,"carousel-item","active"],["src","carrusel.png","alt","First Slide",1,"d-block","w-100"],[1,"search-bar"],[1,"search-container"],["type","text","placeholder","Buscar...",1,"search-input"],[1,"search-btn"]],template:function(o,s){o&1&&(e(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),a(4,"img",4),t()()(),e(5,"div",5)(6,"h1"),n(7,"Encuentra el mejor "),e(8,"span"),n(9,"empleo"),t(),n(10," para ti"),t(),e(11,"div",6),a(12,"input",7),e(13,"button",8),n(14,"Buscar"),t()()()())},styles:[".carousel-container[_ngcontent-%COMP%]{position:relative;height:90vh;width:100%;overflow:hidden;box-shadow:0 4px 10px #00000080}.carousel-control-prev[_ngcontent-%COMP%], .carousel-control-next[_ngcontent-%COMP%]{display:none}.carousel-inner[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:90vh;object-fit:cover;filter:brightness(50%)}.search-bar[_ngcontent-%COMP%]{position:absolute;top:35%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#fff;z-index:10;padding:20px}.search-bar[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:4rem;font-weight:700;margin-bottom:20px}.search-bar[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#0984ff}.search-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;margin-top:20px}.search-input[_ngcontent-%COMP%]{width:500px;padding:15px;font-size:1.2rem;border-radius:30px 0 0 30px;border:none;outline:none;box-shadow:0 4px 10px #0003}.search-btn[_ngcontent-%COMP%]{padding:15px 30px;font-size:1.2rem;border:none;background-color:#1e90ff;color:#fff;border-radius:0 30px 30px 0;cursor:pointer;box-shadow:0 4px 10px #0003;transition:background-color .3s ease}.search-btn[_ngcontent-%COMP%]:hover{background-color:#0056b3}@media (max-width: 768px){.search-container[_ngcontent-%COMP%]{width:90%}.search-input[_ngcontent-%COMP%]{max-width:350px;width:100%;padding:10px;font-size:1rem;border-radius:10px 0 0 10px}.search-btn[_ngcontent-%COMP%]{padding:10px 15px;font-size:1rem;border-radius:0 10px 10px 0}}"]})};var D=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-more-content"]],standalone:!0,features:[c],decls:23,vars:0,consts:[[1,"more-section"],[1,"global-stats"],[1,"stats-grid"],[1,"stat-item"],[1,"join-us"]],template:function(o,s){o&1&&(e(0,"div",0)(1,"div",1)(2,"h3"),n(3,"Impacto Global"),t(),e(4,"div",2)(5,"div",3)(6,"h4"),n(7,"+200,000"),t(),e(8,"p"),n(9,"Empleos ofrecidos en M\xE9xico"),t()(),e(10,"div",3)(11,"h4"),n(12,"+50,000"),t(),e(13,"p"),n(14,"Personas sin estudios conectadas con empleos"),t()(),e(15,"div",3)(16,"h4"),n(17,"30 pa\xEDses"),t(),e(18,"p"),n(19,"Presencia global"),t()()()(),e(20,"div",4)(21,"p"),n(22," \xA1\xDAnete a nuestra comunidad hoy y encuentra la oportunidad que has estado esperando! "),t()()())},styles:[".more-section[_ngcontent-%COMP%]{padding:40px;background-color:#fff;text-align:center;display:flex;flex-direction:column;gap:30px;max-width:1200px;margin:0 auto;border-radius:10px}.about-us[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:32px;color:#222;margin-bottom:10px}.about-us[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:18px;color:#555;line-height:1.6;max-width:800px;margin:0 auto}.global-stats[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:28px;color:#090c9b;margin-bottom:20px}.stats-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;max-width:1000px;margin:0 auto}.stat-item[_ngcontent-%COMP%]{background-color:#e0e7ff;padding:20px;border-radius:8px;box-shadow:0 2px 6px #0000001a}.stat-item[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:24px;color:navy;margin-bottom:10px}.stat-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;color:#333}.join-us[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:20px;color:#090c9b;margin-top:20px;font-weight:700;line-height:1.5}@media (max-width: 768px){.more-section[_ngcontent-%COMP%]{padding:20px}.about-us[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .global-stats[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:24px}.stat-item[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:20px}.stat-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px}}"]})};var k=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-partners-section"]],standalone:!0,features:[c],decls:30,vars:0,consts:[[1,"partners-section"],[1,"partners-grid"],[1,"partner-item"],["src","https://via.placeholder.com/150","alt","Logo Grupo Bimbo"],["src","https://via.placeholder.com/150","alt","Logo CEMEX"],["src","https://via.placeholder.com/150","alt","Logo Walmart"],["src","https://via.placeholder.com/150","alt","Logo Telcel"]],template:function(o,s){o&1&&(e(0,"div",0)(1,"h2"),n(2,"Nuestras Empresas Asociadas"),t(),e(3,"p"),n(4,"Colaboramos con empresas de renombre en M\xE9xico y a nivel global para brindarte las mejores oportunidades laborales."),t(),e(5,"div",1)(6,"div",2),a(7,"img",3),e(8,"h3"),n(9,"Grupo Bimbo"),t(),e(10,"p"),n(11,"L\xEDder mundial en la industria de la panificaci\xF3n, con presencia en m\xE1s de 30 pa\xEDses."),t()(),e(12,"div",2),a(13,"img",4),e(14,"h3"),n(15,"CEMEX"),t(),e(16,"p"),n(17,"Compa\xF1\xEDa global de materiales para la construcci\xF3n con operaciones en m\xE1s de 50 pa\xEDses."),t()(),e(18,"div",2),a(19,"img",5),e(20,"h3"),n(21,"Walmart M\xE9xico"),t(),e(22,"p"),n(23,"Una de las mayores cadenas de tiendas de autoservicio en M\xE9xico, con empleos en todo el pa\xEDs."),t()(),e(24,"div",2),a(25,"img",6),e(26,"h3"),n(27,"Telcel"),t(),e(28,"p"),n(29,"El proveedor l\xEDder de telecomunicaciones en M\xE9xico, conectando a millones de personas diariamente."),t()()()())},styles:[".partners-section[_ngcontent-%COMP%]{padding:40px;background-color:#fff;text-align:center;max-width:1200px;margin:0 auto}.partners-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:32px;color:#090c9b;margin-bottom:10px}.partners-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:18px;color:#555;max-width:800px;margin:0 auto}.partners-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;padding-top:20px}.partner-item[_ngcontent-%COMP%]{background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 6px #0000001a;text-align:center}.partner-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100px;height:100px;margin-bottom:15px;object-fit:contain}.partner-item[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:22px;color:navy;margin-bottom:10px}.partner-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;color:#333}@media (max-width: 768px){.partners-section[_ngcontent-%COMP%]{padding:20px}.partners-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:28px}.partner-item[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:20px}.partner-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px}}"]})};var N=class i{static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-dashboard"]],standalone:!0,features:[c],decls:6,vars:0,template:function(o,s){o&1&&a(0,"app-navbar")(1,"app-busqueda")(2,"app-feature-section")(3,"app-more-content")(4,"app-partners-section")(5,"app-nosotros")},dependencies:[p,w,y,g,E,D,k],encapsulation:2})};var le=i=>({"is-visible":i}),F=class i{isMobile=!1;isFiltersOpen=!1;constructor(){this.checkIfMobile()}checkIfMobile(){this.isMobile=window.innerWidth<=768}toggleFilters(){this.isFiltersOpen=!this.isFiltersOpen}static \u0275fac=function(o){return new(o||i)};static \u0275cmp=l({type:i,selectors:[["app-search-bar"]],standalone:!0,features:[c],decls:37,vars:4,consts:[[1,"search-bar-container"],[1,"filters-button"],[3,"click"],[1,"search-bar",3,"ngClass"],[1,"search-item"],[1,"fas","fa-search"],["type","text","placeholder","Buscar empleo..."],[1,"fas","fa-map-marker-alt"],["selected","","disabled",""],["value","cdmx"],["value","guadalajara"],["value","monterrey"],["value","tiempo-completo"],["value","medio-tiempo"],[1,"fas","fa-angle-down"],["value","10-20k"],["value","20-30k"]],template:function(o,s){o&1&&(e(0,"div",0)(1,"div",1)(2,"button",2),C("click",function(){return s.toggleFilters()}),n(3),t()(),e(4,"div",3)(5,"div",4),a(6,"i",5)(7,"input",6),t(),e(8,"div",4),a(9,"i",7),e(10,"select")(11,"option",8),n(12,"Ciudad o estado..."),t(),e(13,"option",9),n(14,"Ciudad de M\xE9xico"),t(),e(15,"option",10),n(16,"Guadalajara"),t(),e(17,"option",11),n(18,"Monterrey"),t()()(),e(19,"div",4)(20,"select")(21,"option",8),n(22,"Horario"),t(),e(23,"option",12),n(24,"Tiempo Completo"),t(),e(25,"option",13),n(26,"Medio Tiempo"),t()(),a(27,"i",14),t(),e(28,"div",4)(29,"select")(30,"option",8),n(31,"Sueldo"),t(),e(32,"option",15),n(33,"$10,000 - $20,000"),t(),e(34,"option",16),n(35,"$20,000 - $30,000"),t()(),a(36,"i",14),t()()()),o&2&&(m(3),V(" ",s.isFiltersOpen?"Ocultar filtros":"Mostrar filtros"," "),m(),h("ngClass",$(2,le,s.isFiltersOpen)))},dependencies:[p,G],styles:[".search-bar-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;position:relative}.search-bar[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;gap:20px;padding:15px;background-color:#090c9b;width:100%}.search-item[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;width:100%}.search-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .search-item[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{padding:15px 20px;border-radius:10px;border:none;outline:none;font-size:16px;background-color:#fff;width:100%;box-sizing:border-box}.search-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{position:absolute;left:15px;color:#000}.search-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{padding-left:40px}.search-item[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{padding-left:45px;padding-right:25px;appearance:none}.search-item[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] + i[_ngcontent-%COMP%]{position:absolute;right:15px;pointer-events:none}@media (max-width: 768px){.search-bar[_ngcontent-%COMP%]{display:none;flex-direction:column;gap:10px;width:100%}.search-bar.is-visible[_ngcontent-%COMP%]{display:flex;background-color:#fff;border-radius:20px;margin:15px 5px 0;width:95%}.search-item[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .search-item[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:100%;max-width:none;box-sizing:border-box;border-radius:10px;box-shadow:0 4px 6px #0000001a}.filters-button[_ngcontent-%COMP%]{display:block;width:90%;text-align:center;margin-top:20px}.filters-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#fff;color:#1e22aa;border:2px solid #1E22AA;border-radius:30px;padding:10px 20px;font-size:16px;cursor:pointer;width:100%}}@media (min-width: 769px){.filters-button[_ngcontent-%COMP%]{display:none}}"]})};var I=class i{constructor(r){this.userService=r}userName=null;name=null;ngOnInit(){let r=this.userService.getUserData();r?(this.userName=r.email,this.name=r.nombre):(this.userName=null,this.name=null)}logout(){this.userService.clearToken(),this.userName=null,this.name=null}static \u0275fac=function(o){return new(o||i)(x(M))};static \u0275cmp=l({type:i,selectors:[["app-usuarios"]],standalone:!0,features:[c],decls:3,vars:0,template:function(o,s){o&1&&a(0,"app-navbar")(1,"app-search-bar")(2,"router-outlet")},dependencies:[p,v,b,g,F],encapsulation:2})};var z=class i{constructor(r){this.userService=r}userName=null;name=null;ngOnInit(){let r=this.userService.getUserData();r?(this.userName=r.email,this.name=r.nombre):(this.userName=null,this.name=null)}logout(){this.userService.clearToken(),this.userName=null,this.name=null}static \u0275fac=function(o){return new(o||i)(x(M))};static \u0275cmp=l({type:i,selectors:[["app-empresas"]],standalone:!0,features:[c],decls:2,vars:0,template:function(o,s){o&1&&a(0,"app-navbar")(1,"router-outlet")},dependencies:[p,v,b,g],encapsulation:2})};var te=[{path:"",component:N},{path:"auth",loadChildren:()=>import("./chunk-7CUJ7CBM.js").then(i=>i.AUTH_ROUTES)},{path:"usuario",component:I,loadChildren:()=>import("./chunk-J7NNUZ22.js").then(i=>i.usuariosRoutes)},{path:"empresa",component:z,loadChildren:()=>import("./chunk-6KYVA2CM.js").then(i=>i.empresasRoutes)},{path:"**",redirectTo:""}];var ce={providers:[Y(te),X()]};W(S,ce).catch(i=>console.error(i));
