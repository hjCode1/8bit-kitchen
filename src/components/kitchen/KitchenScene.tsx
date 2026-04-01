import PixelFridge from "./PixelFridge";
import PixelCounter from "./PixelCounter";
import PixelOven from "./PixelOven";
import PixelCabinet from "./PixelCabinet";
import PixelClock from "./PixelClock";
import PixelCoffeeCup from "./PixelCoffeeCup";

interface KitchenSceneProps {
  onOpenFridge: () => void;
  onOpenCounter: () => void;
}

export default function KitchenScene({
  onOpenFridge,
  onOpenCounter,
}: KitchenSceneProps) {
  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        aspectRatio: "4 / 3",
        fontSize: "clamp(8px, 2.5vw, 16px)",
      }}
    >
      {/* 벽 */}
      <div
        className="absolute inset-0 bg-[#B8D4A0]"
        style={{ bottom: "25%" }}
      />

      {/* 바닥 */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-[#8B6914]"
        style={{
          height: "25%",
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 45%,
            #7A5A10 45%,
            #7A5A10 50%,
            transparent 50%,
            transparent 95%,
            #7A5A10 95%,
            #7A5A10 100%
          )`,
        }}
      />

      {/* 상부장 (왼쪽 위) */}
      <div className="absolute" style={{ top: "5%", left: "25%" }}>
        <PixelCabinet />
      </div>

      {/* 시계 (오른쪽 위) */}
      <div className="absolute" style={{ top: "5%", right: "25%" }}>
        <PixelClock />
      </div>

      {/* 카운터 라인 (가구 받침) */}
      <div
        className="absolute left-0 right-0 bg-[#D4A574] border-y-4 border-[#6B4423]"
        style={{ bottom: "25%", height: "4px" }}
      />

      {/* 오븐 (왼쪽) */}
      <div
        className="absolute"
        style={{ bottom: "25%", left: "24%", transform: "translateY(0)" }}
      >
        <PixelOven />
      </div>

      {/* 커피잔 (오븐 위) */}
      <div
        className="absolute"
        style={{ bottom: "calc(23% + 7.5em)", left: "30%" }}
      >
        <PixelCoffeeCup />
      </div>

      {/* 조리대/싱크대 (가운데) - 클릭 가능 */}
      <div
        className="absolute"
        style={{ bottom: "25%", left: "37%", transform: "translateY(0)" }}
      >
        <PixelCounter onOpen={onOpenCounter} />
      </div>

      {/* 냉장고 (오른쪽) - 클릭 가능 */}
      <div
        className="absolute"
        style={{ bottom: "25%", right: "23%", transform: "translateY(0)" }}
      >
        <PixelFridge onOpen={onOpenFridge} />
      </div>

      {/* 인터랙션 힌트 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[12px] text-pixel-text/40">
        냉장고 또는 조리대를 클릭하세요
      </div>
    </div>
  );
}
