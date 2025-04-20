drop function if exists "public"."handle_new_user"();

alter table "public"."budget_expenses" add column "name" text not null;


