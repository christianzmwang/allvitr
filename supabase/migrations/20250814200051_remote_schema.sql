drop extension if exists "pg_net";


  create table "public"."enheter" (
    "organisasjonsnummer" text not null,
    "navn" text not null,
    "organisasjonsform" jsonb,
    "forretningsadresse" jsonb,
    "postadresse" jsonb,
    "naeringskode1" jsonb,
    "registreringsdatoEnhetsregisteret" date,
    "konkurs" boolean,
    "underAvvikling" boolean,
    "raw" jsonb not null
      );


CREATE UNIQUE INDEX enheter_organisasjonsnummer_idx ON public.enheter USING btree (organisasjonsnummer);

CREATE UNIQUE INDEX enheter_pkey ON public.enheter USING btree (organisasjonsnummer);

alter table "public"."enheter" add constraint "enheter_pkey" PRIMARY KEY using index "enheter_pkey";

grant delete on table "public"."enheter" to "anon";

grant insert on table "public"."enheter" to "anon";

grant references on table "public"."enheter" to "anon";

grant select on table "public"."enheter" to "anon";

grant trigger on table "public"."enheter" to "anon";

grant truncate on table "public"."enheter" to "anon";

grant update on table "public"."enheter" to "anon";

grant delete on table "public"."enheter" to "authenticated";

grant insert on table "public"."enheter" to "authenticated";

grant references on table "public"."enheter" to "authenticated";

grant select on table "public"."enheter" to "authenticated";

grant trigger on table "public"."enheter" to "authenticated";

grant truncate on table "public"."enheter" to "authenticated";

grant update on table "public"."enheter" to "authenticated";

grant delete on table "public"."enheter" to "service_role";

grant insert on table "public"."enheter" to "service_role";

grant references on table "public"."enheter" to "service_role";

grant select on table "public"."enheter" to "service_role";

grant trigger on table "public"."enheter" to "service_role";

grant truncate on table "public"."enheter" to "service_role";

grant update on table "public"."enheter" to "service_role";


