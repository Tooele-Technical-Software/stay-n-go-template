"use client";

import { useState } from "react";
import type { ListingPhoto } from "@/lib/listing-photos";

export default function ListingGallery({
  photos,
  title,
}: {
  photos: ListingPhoto[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="mb-8">
      <div className="hidden h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:grid">
        <button
          onClick={() => setActive(0)}
          className="col-span-2 row-span-2 overflow-hidden"
          style={{ background: photos[0].gradient }}
          aria-label={`${title} photo 1`}
        />
        {photos.slice(1, 5).map((photo) => (
          <button
            key={photo.id}
            onClick={() => setActive(photo.id)}
            className="overflow-hidden transition-opacity hover:opacity-90"
            style={{ background: photo.gradient }}
            aria-label={`${title} photo ${photo.id + 1}`}
          />
        ))}
      </div>

      <div className="md:hidden">
        <div
          className="h-64 w-full rounded-2xl"
          style={{ background: photos[active].gradient }}
        />
        <div className="mt-3 flex justify-center gap-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setActive(photo.id)}
              className={`h-2 w-2 rounded-full transition-colors ${
                active === photo.id ? "bg-primary" : "bg-input-border"
              }`}
              aria-label={`Show photo ${photo.id + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 hidden gap-2 md:flex">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setActive(photo.id)}
            className={`h-14 w-20 rounded-lg border-2 transition-all ${
              active === photo.id
                ? "border-primary"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
            style={{ background: photo.gradient }}
            aria-label={`Preview photo ${photo.id + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
