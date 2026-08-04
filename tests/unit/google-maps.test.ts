import { describe, expect, it } from "vitest";
import {
  coordinatesFromGoogleMapsUrl,
  isAllowedGoogleMapsUrl,
  isPersistableGoogleMapsUrl
} from "@/lib/google-maps";

describe("Google Maps location import", () => {
  it("accepts only official HTTPS Google Maps hosts", () => {
    expect(isAllowedGoogleMapsUrl("https://maps.app.goo.gl/example")).toBe(true);
    expect(isAllowedGoogleMapsUrl("https://www.google.com/maps/place/Torres")).toBe(true);
    expect(isAllowedGoogleMapsUrl("http://www.google.com/maps/place/Torres")).toBe(false);
    expect(isAllowedGoogleMapsUrl("https://google.com.example.org/maps/place/Torres")).toBe(false);
  });

  it("aceita para persistência somente formatos compatíveis com o banco", () => {
    expect(isPersistableGoogleMapsUrl("https://maps.app.goo.gl/example")).toBe(true);
    expect(isPersistableGoogleMapsUrl("https://www.google.com/maps/place/Torres")).toBe(true);
    expect(isPersistableGoogleMapsUrl("https://goo.gl/example")).toBe(false);
  });

  it("extracts coordinates from map viewport URLs", () => {
    expect(
      coordinatesFromGoogleMapsUrl(
        "https://www.google.com/maps/place/Torres/@-29.3357,-49.726,15z"
      )
    ).toEqual({ latitude: -29.3357, longitude: -49.726 });
  });

  it("extracts coordinates from Google Maps data parameters", () => {
    expect(
      coordinatesFromGoogleMapsUrl(
        "https://www.google.com/maps/place/Torres/data=!3m1!4b1!3d-29.3357!4d-49.726"
      )
    ).toEqual({ latitude: -29.3357, longitude: -49.726 });
  });

  it("rejects links without coordinates", () => {
    expect(
      coordinatesFromGoogleMapsUrl("https://www.google.com/maps/place/Torres")
    ).toBeNull();
  });
});
