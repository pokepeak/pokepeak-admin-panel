import { NextRequest, NextResponse } from "next/server";

// Einfacher Passwortschutz (Basic Auth) für das gesamte Admin-Panel.
// Nur Luca kennt das Passwort aus der Umgebungsvariable ADMIN_PASSWORD.
export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expected = process.env.ADMIN_PASSWORD;

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const [, password] = decoded.split(":");
      if (password === expected) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Anmeldung erforderlich", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="PokePeak Chat Admin"' },
  });
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
