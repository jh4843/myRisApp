import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    // must be declared by every route
  }
}
