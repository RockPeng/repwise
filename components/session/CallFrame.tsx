import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { Chamfer } from "@/components/ui/Chamfer";
import { Icon } from "@/components/ui/Icon";

/**
 * The video call frame.
 *
 * A 1:1 coaching session is the thing the marketplace cannot sell as a
 * download, so it gets a picture on the marketing page: the coach on screen,
 * the member in the corner, and the controls that make it feel like a real
 * call rather than a mockup.
 */
export function CallFrame({
  coach,
  coachImage,
  memberName,
  memberAvatar,
  elapsed = "12:04",
}: {
  coach: string;
  coachImage: string;
  memberName: string;
  memberAvatar: string;
  elapsed?: string;
}) {
  return (
    <Chamfer
      cut={40}
      accent
      className="aspect-[16/10] w-full overflow-hidden bg-surface-2"
    >
      <Image
        src={coachImage}
        alt={`${coach} on a video call`}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

      {/* A dark wash so the call controls stay legible over any photo. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/35" />

      {/* The member's own camera, in the corner, as it appears in a real call. */}
      <div className="absolute bottom-4 right-4 w-[26%] min-w-[92px] overflow-hidden rounded-field border border-white/15 bg-black/60">
        <div className="relative aspect-[4/3]">
          <Image
            src={memberAvatar}
            alt=""
            fill
            sizes="120px"
            className="object-cover opacity-90"
          />
        </div>
      </div>

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-danger" />
        <span className="text-[12px] font-medium text-white/90">{elapsed}</span>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur-sm">
          <Icon name="mic" size={16} />
        </span>
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur-sm">
          <Icon name="video" size={16} />
        </span>
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-danger text-white">
          <Icon name="phone" size={16} />
        </span>
        <span className="ml-1 hidden text-[12px] text-white/70 sm:inline">
          {coach}
        </span>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
        <Avatar name={coach} size={20} />
        <span className="text-[12px] font-medium text-white/90">{coach}</span>
      </div>
    </Chamfer>
  );
}
