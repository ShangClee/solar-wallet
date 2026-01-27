import { describe, expect, it } from "vitest"
import { max } from "./strings"

describe("Generic/lib/strings", () => {
  describe("max()", () => {
    it("returns the lexicographically largest string", () => {
      expect(max(["a", "b", "c"])).toBe("c")
      expect(max(["apple", "banana", "cherry"])).toBe("cherry")
    })

    it("returns undefined for empty array", () => {
      expect(max([])).toBeUndefined()
    })

    it("handles single item array", () => {
      expect(max(["foo"])).toBe("foo")
    })

    it("supports leftpad for numeric string comparison", () => {
      // Without leftpad, "10" < "2"
      expect(max(["10", "2", "5"])).toBe("5")
      // With leftpad, "10" > "02" > "05"
      expect(max(["10", "2", "5"], "0")).toBe("10")
    })
  })
})
