import React, { useState, useMemo } from "react";

const GlyphsGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedGlyph, setCopiedGlyph] = useState(null);
  const [characterChain, setCharacterChain] = useState("");
  const [copiedChain, setCopiedChain] = useState(false);

  // Grid configuration per category (optional)
  const categoryGridConfig = {
    tableFlip: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    // Add more custom grid configs here as needed
  };

  const glyphCategories = {
    arrows: {
      name: "Arrows",
      glyphs: [
        { char: "→", code: "U+2192", name: "Rightwards Arrow" },
        { char: "←", code: "U+2190", name: "Leftwards Arrow" },
        { char: "↑", code: "U+2191", name: "Upwards Arrow" },
        { char: "↓", code: "U+2193", name: "Downwards Arrow" },
        { char: "↔", code: "U+2194", name: "Left Right Arrow" },
        { char: "↕", code: "U+2195", name: "Up Down Arrow" },
        { char: "↖", code: "U+2196", name: "North West Arrow" },
        { char: "↗", code: "U+2197", name: "North East Arrow" },
        { char: "↘", code: "U+2198", name: "South East Arrow" },
        { char: "↙", code: "U+2199", name: "South West Arrow" },
        { char: "⇒", code: "U+21D2", name: "Rightwards Double Arrow" },
        { char: "⇐", code: "U+21D0", name: "Leftwards Double Arrow" },
        { char: "⇑", code: "U+21D1", name: "Upwards Double Arrow" },
        { char: "⇓", code: "U+21D3", name: "Downwards Double Arrow" },
        { char: "⇔", code: "U+21D4", name: "Left Right Double Arrow" },
        { char: "⇕", code: "U+21D5", name: "Up Down Double Arrow" },
      ],
    },
    math: {
      name: "Mathematical",
      glyphs: [
        { char: "+", code: "U+002B", name: "Plus Sign" },
        { char: "−", code: "U+2212", name: "Minus Sign" },
        { char: "×", code: "U+00D7", name: "Multiplication Sign" },
        { char: "÷", code: "U+00F7", name: "Division Sign" },
        { char: "=", code: "U+003D", name: "Equals Sign" },
        { char: "≠", code: "U+2260", name: "Not Equal To" },
        { char: "<", code: "U+003C", name: "Less-Than Sign" },
        { char: ">", code: "U+003E", name: "Greater-Than Sign" },
        { char: "≤", code: "U+2264", name: "Less-Than Or Equal To" },
        { char: "≥", code: "U+2265", name: "Greater-Than Or Equal To" },
        { char: "±", code: "U+00B1", name: "Plus-Minus Sign" },
        { char: "∞", code: "U+221E", name: "Infinity" },
        { char: "∑", code: "U+2211", name: "N-Ary Summation" },
        { char: "√", code: "U+221A", name: "Square Root" },
        { char: "∫", code: "U+222B", name: "Integral" },
        { char: "π", code: "U+03C0", name: "Greek Small Letter Pi" },
      ],
    },
    currency: {
      name: "Currency",
      glyphs: [
        { char: "$", code: "U+0024", name: "Dollar Sign" },
        { char: "€", code: "U+20AC", name: "Euro Sign" },
        { char: "£", code: "U+00A3", name: "Pound Sign" },
        { char: "¥", code: "U+00A5", name: "Yen Sign" },
        { char: "¢", code: "U+00A2", name: "Cent Sign" },
        { char: "₹", code: "U+20B9", name: "Indian Rupee Sign" },
        { char: "₽", code: "U+20BD", name: "Ruble Sign" },
        { char: "₩", code: "U+20A9", name: "Won Sign" },
        { char: "₪", code: "U+20AA", name: "New Sheqel Sign" },
        { char: "₫", code: "U+20AB", name: "Dong Sign" },
        { char: "₱", code: "U+20B1", name: "Peso Sign" },
        { char: "₨", code: "U+20A8", name: "Rupee Sign" },
      ],
    },
    punctuation: {
      name: "Punctuation",
      glyphs: [
        { char: "•", code: "U+2022", name: "Bullet" },
        { char: "·", code: "U+00B7", name: "Middle Dot" },
        { char: "…", code: "U+2026", name: "Horizontal Ellipsis" },
        { char: "—", code: "U+2014", name: "Em Dash" },
        { char: "–", code: "U+2013", name: "En Dash" },
        { char: '"', code: "U+201C", name: "Left Double Quotation Mark" },
        { char: '"', code: "U+201D", name: "Right Double Quotation Mark" },
        { char: "'", code: "U+2018", name: "Left Single Quotation Mark" },
        { char: "'", code: "U+2019", name: "Right Single Quotation Mark" },
        {
          char: "«",
          code: "U+00AB",
          name: "Left-Pointing Double Angle Quotation Mark",
        },
        {
          char: "»",
          code: "U+00BB",
          name: "Right-Pointing Double Angle Quotation Mark",
        },
        { char: "¿", code: "U+00BF", name: "Inverted Question Mark" },
        { char: "¡", code: "U+00A1", name: "Inverted Exclamation Mark" },
        { char: "§", code: "U+00A7", name: "Section Sign" },
        { char: "¶", code: "U+00B6", name: "Pilcrow Sign" },
        { char: "†", code: "U+2020", name: "Dagger" },
      ],
    },
    symbols: {
      name: "Symbols",
      glyphs: [
        { char: "©", code: "U+00A9", name: "Copyright Sign" },
        { char: "®", code: "U+00AE", name: "Registered Sign" },
        { char: "™", code: "U+2122", name: "Trade Mark Sign" },
        { char: "℅", code: "U+2105", name: "Care Of" },
        { char: "℮", code: "U+212E", name: "Estimated Symbol" },
        { char: "°", code: "U+00B0", name: "Degree Sign" },
        { char: "℃", code: "U+2103", name: "Degree Celsius" },
        { char: "℉", code: "U+2109", name: "Degree Fahrenheit" },
        { char: "@", code: "U+0040", name: "Commercial At" },
        { char: "#", code: "U+0023", name: "Number Sign" },
        { char: "&", code: "U+0026", name: "Ampersand" },
        { char: "%", code: "U+0025", name: "Percent Sign" },
        { char: "‰", code: "U+2030", name: "Per Mille Sign" },
        { char: "№", code: "U+2116", name: "Numero Sign" },
        { char: "℞", code: "U+211E", name: "Prescription Take" },
        { char: "℅", code: "U+2105", name: "Care Of" },
      ],
    },
    shapes: {
      name: "Shapes",
      glyphs: [
        { char: "●", code: "U+25CF", name: "Black Circle" },
        { char: "○", code: "U+25CB", name: "White Circle" },
        { char: "■", code: "U+25A0", name: "Black Square" },
        { char: "□", code: "U+25A1", name: "White Square" },
        { char: "▲", code: "U+25B2", name: "Black Up-Pointing Triangle" },
        { char: "△", code: "U+25B3", name: "White Up-Pointing Triangle" },
        { char: "▼", code: "U+25BC", name: "Black Down-Pointing Triangle" },
        { char: "▽", code: "U+25BD", name: "White Down-Pointing Triangle" },
        { char: "◆", code: "U+25C6", name: "Black Diamond" },
        { char: "◇", code: "U+25C7", name: "White Diamond" },
        { char: "★", code: "U+2605", name: "Black Star" },
        { char: "☆", code: "U+2606", name: "White Star" },
        { char: "♠", code: "U+2660", name: "Black Spade Suit" },
        { char: "♣", code: "U+2663", name: "Black Club Suit" },
        { char: "♥", code: "U+2665", name: "Black Heart Suit" },
        { char: "♦", code: "U+2666", name: "Black Diamond Suit" },
      ],
    },
    greek: {
      name: "Greek Letters",
      glyphs: [
        { char: "α", code: "U+03B1", name: "Greek Small Letter Alpha" },
        { char: "β", code: "U+03B2", name: "Greek Small Letter Beta" },
        { char: "γ", code: "U+03B3", name: "Greek Small Letter Gamma" },
        { char: "δ", code: "U+03B4", name: "Greek Small Letter Delta" },
        { char: "ε", code: "U+03B5", name: "Greek Small Letter Epsilon" },
        { char: "ζ", code: "U+03B6", name: "Greek Small Letter Zeta" },
        { char: "η", code: "U+03B7", name: "Greek Small Letter Eta" },
        { char: "θ", code: "U+03B8", name: "Greek Small Letter Theta" },
        { char: "λ", code: "U+03BB", name: "Greek Small Letter Lamda" },
        { char: "μ", code: "U+03BC", name: "Greek Small Letter Mu" },
        { char: "σ", code: "U+03C3", name: "Greek Small Letter Sigma" },
        { char: "φ", code: "U+03C6", name: "Greek Small Letter Phi" },
        { char: "ψ", code: "U+03C8", name: "Greek Small Letter Psi" },
        { char: "ω", code: "U+03C9", name: "Greek Small Letter Omega" },
        { char: "Ω", code: "U+03A9", name: "Greek Capital Letter Omega" },
        { char: "Σ", code: "U+03A3", name: "Greek Capital Letter Sigma" },
      ],
    },
    checkmarks: {
      name: "Checkmarks & Crosses",
      glyphs: [
        { char: "✓", code: "U+2713", name: "Check Mark" },
        { char: "✔", code: "U+2714", name: "Heavy Check Mark" },
        { char: "✗", code: "U+2717", name: "Ballot X" },
        { char: "✘", code: "U+2718", name: "Heavy Ballot X" },
        { char: "☑", code: "U+2611", name: "Ballot Box with Check" },
        { char: "☐", code: "U+2610", name: "Ballot Box" },
        { char: "☒", code: "U+2612", name: "Ballot Box with X" },
        { char: "⊕", code: "U+2295", name: "Circled Plus" },
        { char: "⊖", code: "U+2296", name: "Circled Minus" },
        { char: "⊗", code: "U+2297", name: "Circled Times" },
        { char: "⊘", code: "U+2298", name: "Circled Division Slash" },
        { char: "⊙", code: "U+2299", name: "Circled Dot Operator" },
      ],
    },
    zalgo: {
      name: "Zalgo (Combining)",
      glyphs: [
        { char: "̀", code: "U+0300", name: "Combining Grave Accent" },
        { char: "́", code: "U+0301", name: "Combining Acute Accent" },
        { char: "̂", code: "U+0302", name: "Combining Circumflex" },
        { char: "̃", code: "U+0303", name: "Combining Tilde" },
        { char: "̄", code: "U+0304", name: "Combining Macron" },
        { char: "̅", code: "U+0305", name: "Combining Overline" },
        { char: "̆", code: "U+0306", name: "Combining Breve" },
        { char: "̇", code: "U+0307", name: "Combining Dot Above" },
        { char: "̈", code: "U+0308", name: "Combining Diaeresis" },
        { char: "̉", code: "U+0309", name: "Combining Hook Above" },
        { char: "̊", code: "U+030A", name: "Combining Ring Above" },
        { char: "̋", code: "U+030B", name: "Combining Double Acute" },
        { char: "̌", code: "U+030C", name: "Combining Caron" },
        { char: "̍", code: "U+030D", name: "Combining Vertical Line Above" },
        {
          char: "̎",
          code: "U+030E",
          name: "Combining Double Vertical Line Above",
        },
        { char: "̏", code: "U+030F", name: "Combining Double Grave" },
        { char: "̐", code: "U+0310", name: "Combining Candrabindu" },
        { char: "̑", code: "U+0311", name: "Combining Inverted Breve" },
        { char: "̒", code: "U+0312", name: "Combining Turned Comma Above" },
        { char: "̓", code: "U+0313", name: "Combining Comma Above" },
        { char: "̔", code: "U+0314", name: "Combining Reversed Comma Above" },
        { char: "̕", code: "U+0315", name: "Combining Comma Above Right" },
        { char: "̖", code: "U+0316", name: "Combining Grave Below" },
        { char: "̗", code: "U+0317", name: "Combining Acute Below" },
        { char: "̘", code: "U+0318", name: "Combining Left Tack Below" },
        { char: "̙", code: "U+0319", name: "Combining Right Tack Below" },
        { char: "̚", code: "U+031A", name: "Combining Left Angle Above" },
        { char: "̛", code: "U+031B", name: "Combining Horn" },
        { char: "̜", code: "U+031C", name: "Combining Left Half Ring Below" },
        { char: "̝", code: "U+031D", name: "Combining Up Tack Below" },
        { char: "̞", code: "U+031E", name: "Combining Down Tack Below" },
        { char: "̟", code: "U+031F", name: "Combining Plus Sign Below" },
        { char: "̠", code: "U+0320", name: "Combining Minus Sign Below" },
      ],
    },
    boxDrawing: {
      name: "Box Drawing",
      glyphs: [
        { char: "─", code: "U+2500", name: "Box Drawings Light Horizontal" },
        { char: "━", code: "U+2501", name: "Box Drawings Heavy Horizontal" },
        { char: "│", code: "U+2502", name: "Box Drawings Light Vertical" },
        { char: "┃", code: "U+2503", name: "Box Drawings Heavy Vertical" },
        {
          char: "┌",
          code: "U+250C",
          name: "Box Drawings Light Down and Right",
        },
        { char: "┐", code: "U+2510", name: "Box Drawings Light Down and Left" },
        { char: "└", code: "U+2514", name: "Box Drawings Light Up and Right" },
        { char: "┘", code: "U+2518", name: "Box Drawings Light Up and Left" },
        {
          char: "├",
          code: "U+251C",
          name: "Box Drawings Light Vertical and Right",
        },
        {
          char: "┤",
          code: "U+2524",
          name: "Box Drawings Light Vertical and Left",
        },
        {
          char: "┬",
          code: "U+252C",
          name: "Box Drawings Light Down and Horizontal",
        },
        {
          char: "┴",
          code: "U+2534",
          name: "Box Drawings Light Up and Horizontal",
        },
        {
          char: "┼",
          code: "U+253C",
          name: "Box Drawings Light Vertical and Horizontal",
        },
        {
          char: "╔",
          code: "U+2554",
          name: "Box Drawings Double Down and Right",
        },
        {
          char: "╗",
          code: "U+2557",
          name: "Box Drawings Double Down and Left",
        },
        { char: "╚", code: "U+255A", name: "Box Drawings Double Up and Right" },
        { char: "╝", code: "U+255D", name: "Box Drawings Double Up and Left" },
        { char: "║", code: "U+2551", name: "Box Drawings Double Vertical" },
        { char: "═", code: "U+2550", name: "Box Drawings Double Horizontal" },
        {
          char: "╬",
          code: "U+256C",
          name: "Box Drawings Double Vertical and Horizontal",
        },
      ],
    },
    fractions: {
      name: "Fractions",
      glyphs: [
        { char: "½", code: "U+00BD", name: "Vulgar Fraction One Half" },
        { char: "⅓", code: "U+2153", name: "Vulgar Fraction One Third" },
        { char: "⅔", code: "U+2154", name: "Vulgar Fraction Two Thirds" },
        { char: "¼", code: "U+00BC", name: "Vulgar Fraction One Quarter" },
        { char: "¾", code: "U+00BE", name: "Vulgar Fraction Three Quarters" },
        { char: "⅕", code: "U+2155", name: "Vulgar Fraction One Fifth" },
        { char: "⅖", code: "U+2156", name: "Vulgar Fraction Two Fifths" },
        { char: "⅗", code: "U+2157", name: "Vulgar Fraction Three Fifths" },
        { char: "⅘", code: "U+2158", name: "Vulgar Fraction Four Fifths" },
        { char: "⅙", code: "U+2159", name: "Vulgar Fraction One Sixth" },
        { char: "⅚", code: "U+215A", name: "Vulgar Fraction Five Sixths" },
        { char: "⅐", code: "U+2150", name: "Vulgar Fraction One Seventh" },
        { char: "⅛", code: "U+215B", name: "Vulgar Fraction One Eighth" },
        { char: "⅜", code: "U+215C", name: "Vulgar Fraction Three Eighths" },
        { char: "⅝", code: "U+215D", name: "Vulgar Fraction Five Eighths" },
        { char: "⅞", code: "U+215E", name: "Vulgar Fraction Seven Eighths" },
      ],
    },
    superscript: {
      name: "Superscript & Subscript",
      glyphs: [
        { char: "⁰", code: "U+2070", name: "Superscript Zero" },
        { char: "¹", code: "U+00B9", name: "Superscript One" },
        { char: "²", code: "U+00B2", name: "Superscript Two" },
        { char: "³", code: "U+00B3", name: "Superscript Three" },
        { char: "⁴", code: "U+2074", name: "Superscript Four" },
        { char: "⁵", code: "U+2075", name: "Superscript Five" },
        { char: "⁶", code: "U+2076", name: "Superscript Six" },
        { char: "⁷", code: "U+2077", name: "Superscript Seven" },
        { char: "⁸", code: "U+2078", name: "Superscript Eight" },
        { char: "⁹", code: "U+2079", name: "Superscript Nine" },
        { char: "ⁿ", code: "U+207F", name: "Superscript Latin Small Letter N" },
        { char: "₀", code: "U+2080", name: "Subscript Zero" },
        { char: "₁", code: "U+2081", name: "Subscript One" },
        { char: "₂", code: "U+2082", name: "Subscript Two" },
        { char: "₃", code: "U+2083", name: "Subscript Three" },
        { char: "₄", code: "U+2084", name: "Subscript Four" },
        { char: "₅", code: "U+2085", name: "Subscript Five" },
        { char: "₆", code: "U+2086", name: "Subscript Six" },
        { char: "₇", code: "U+2087", name: "Subscript Seven" },
        { char: "₈", code: "U+2088", name: "Subscript Eight" },
        { char: "₉", code: "U+2089", name: "Subscript Nine" },
      ],
    },
    music: {
      name: "Music Symbols",
      glyphs: [
        { char: "♩", code: "U+2669", name: "Quarter Note" },
        { char: "♪", code: "U+266A", name: "Eighth Note" },
        { char: "♫", code: "U+266B", name: "Beamed Eighth Notes" },
        { char: "♬", code: "U+266C", name: "Beamed Sixteenth Notes" },
        { char: "♭", code: "U+266D", name: "Music Flat Sign" },
        { char: "♮", code: "U+266E", name: "Music Natural Sign" },
        { char: "♯", code: "U+266F", name: "Music Sharp Sign" },
        { char: "𝄞", code: "U+1D11E", name: "Musical Symbol G Clef" },
        { char: "𝄢", code: "U+1D122", name: "Musical Symbol F Clef" },
        { char: "𝄆", code: "U+1D106", name: "Musical Symbol Left Repeat Sign" },
        {
          char: "𝄇",
          code: "U+1D107",
          name: "Musical Symbol Right Repeat Sign",
        },
        { char: "𝄐", code: "U+1D110", name: "Musical Symbol Fermata" },
      ],
    },
    roman: {
      name: "Roman Numerals",
      glyphs: [
        { char: "Ⅰ", code: "U+2160", name: "Roman Numeral One" },
        { char: "Ⅱ", code: "U+2161", name: "Roman Numeral Two" },
        { char: "Ⅲ", code: "U+2162", name: "Roman Numeral Three" },
        { char: "Ⅳ", code: "U+2163", name: "Roman Numeral Four" },
        { char: "Ⅴ", code: "U+2164", name: "Roman Numeral Five" },
        { char: "Ⅵ", code: "U+2165", name: "Roman Numeral Six" },
        { char: "Ⅶ", code: "U+2166", name: "Roman Numeral Seven" },
        { char: "Ⅷ", code: "U+2167", name: "Roman Numeral Eight" },
        { char: "Ⅸ", code: "U+2168", name: "Roman Numeral Nine" },
        { char: "Ⅹ", code: "U+2169", name: "Roman Numeral Ten" },
        { char: "Ⅺ", code: "U+216A", name: "Roman Numeral Eleven" },
        { char: "Ⅻ", code: "U+216B", name: "Roman Numeral Twelve" },
        { char: "Ⅼ", code: "U+216C", name: "Roman Numeral Fifty" },
        { char: "Ⅽ", code: "U+216D", name: "Roman Numeral One Hundred" },
        { char: "Ⅾ", code: "U+216E", name: "Roman Numeral Five Hundred" },
        { char: "Ⅿ", code: "U+216F", name: "Roman Numeral One Thousand" },
      ],
    },
    weather: {
      name: "Weather & Nature",
      glyphs: [
        { char: "☀", code: "U+2600", name: "Black Sun with Rays" },
        { char: "☁", code: "U+2601", name: "Cloud" },
        { char: "☂", code: "U+2602", name: "Umbrella" },
        { char: "☃", code: "U+2603", name: "Snowman" },
        { char: "☄", code: "U+2604", name: "Comet" },
        { char: "★", code: "U+2605", name: "Black Star" },
        { char: "☆", code: "U+2606", name: "White Star" },
        { char: "☇", code: "U+2607", name: "Lightning" },
        { char: "☈", code: "U+2608", name: "Thunderstorm" },
        { char: "☉", code: "U+2609", name: "Sun" },
        { char: "☊", code: "U+260A", name: "Ascending Node" },
        { char: "☋", code: "U+260B", name: "Descending Node" },
        { char: "☌", code: "U+260C", name: "Conjunction" },
        { char: "☍", code: "U+260D", name: "Opposition" },
        { char: "☽", code: "U+263D", name: "First Quarter Moon" },
        { char: "☾", code: "U+263E", name: "Last Quarter Moon" },
        { char: "❄", code: "U+2744", name: "Snowflake" },
        { char: "❅", code: "U+2745", name: "Tight Trifoliate Snowflake" },
        { char: "❆", code: "U+2746", name: "Heavy Chevron Snowflake" },
      ],
    },
    tableFlip: {
      name: "Table Flips & Kaomoji",
      glyphs: [
        { char: "(╯°□°）╯︵ ┻━┻", code: "Kaomoji", name: "Classic Table Flip" },
        { char: "┬─┬ ノ( ゜-゜ノ)", code: "Kaomoji", name: "Put Table Back" },
        { char: "(ノಠ益ಠ)ノ彡┻━┻", code: "Kaomoji", name: "Angry Table Flip" },
        {
          char: "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻",
          code: "Kaomoji",
          name: "Double Table Flip",
        },
        { char: "┬─┬ノ(ಠ_ಠノ)", code: "Kaomoji", name: "Disapproval Put Back" },
        { char: "(╯°Д°）╯︵/(.□ . \\)", code: "Kaomoji", name: "Person Flip" },
        {
          char: "(ノಥ,_｣ಥ)ノ彡┻━┻",
          code: "Kaomoji",
          name: "Crying Table Flip",
        },
        { char: "(┛◉Д◉)┛彡┻━┻", code: "Kaomoji", name: "Crazy Table Flip" },
        { char: "(ﾉ≧∇≦)ﾉ ﾐ ┻━┻", code: "Kaomoji", name: "Happy Table Flip" },
        { char: "(ノ￣皿￣）ノ ⌒=== ┫", code: "Kaomoji", name: "Table Throw" },
        { char: "┻━┻ミ＼(≧ﾛ≦＼)", code: "Kaomoji", name: "Catch Table" },
        { char: "(┛ಸ_ಸ)┛彡┻━┻", code: "Kaomoji", name: "Serious Flip" },
        {
          char: "(╯°□°)╯︵ ƃuıʇǝʞɹɐɯ",
          code: "Kaomoji",
          name: "Marketing Flip",
        },
        { char: "(ノ͡° ͜ʖ ͡°)ノ︵┻┻", code: "Kaomoji", name: "Lenny Table Flip" },
        { char: "ʕノ•ᴥ•ʔノ ︵ ┻━┻", code: "Kaomoji", name: "Bear Table Flip" },
        { char: "┬─┬ ︵ /(.□. \\）", code: "Kaomoji", name: "Table Flips You" },
        {
          char: "(╯°□°）╯︵ ┻━┻ ︵ ╯(°□° ╯)",
          code: "Kaomoji",
          name: "Table Battle",
        },
        { char: "(ノ°_o)ノ⌒┻━┻", code: "Kaomoji", name: "Confused Flip" },
        { char: "┻━┻︵└(՞▽՞ └)", code: "Kaomoji", name: "Sneaky Flip" },
        { char: "┻━┻︵└(´▽｀)┘︵┻━┻", code: "Kaomoji", name: "Dance Flip" },
      ],
    },
  };

  const filteredGlyphs = useMemo(() => {
    let glyphs = [];

    if (selectedCategory === "all") {
      Object.values(glyphCategories).forEach((category) => {
        glyphs = [...glyphs, ...category.glyphs];
      });
    } else {
      glyphs = glyphCategories[selectedCategory]?.glyphs || [];
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      glyphs = glyphs.filter(
        (glyph) =>
          glyph.char.includes(searchTerm) ||
          glyph.name.toLowerCase().includes(lowerSearch) ||
          glyph.code.toLowerCase().includes(lowerSearch)
      );
    }

    return glyphs;
  }, [selectedCategory, searchTerm]);

  const handleGlyphClick = async (glyph) => {
    // Add to character chain
    setCharacterChain((prev) => prev + glyph.char);

    // Also copy individual glyph to clipboard
    try {
      await navigator.clipboard.writeText(glyph.char);
      setCopiedGlyph(glyph.char);
      setTimeout(() => setCopiedGlyph(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyChainToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(characterChain);
      setCopiedChain(true);
      setTimeout(() => setCopiedChain(false), 2000);
    } catch (err) {
      console.error("Failed to copy chain:", err);
    }
  };

  const clearChain = () => {
    setCharacterChain("");
  };

  return (
    <div className="bg-background rounded-sm p-6 my-6 border border-neutral-500/20 shadow-sm">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-lg my-0 font-semibold text-gray-900 dark:text-gray-100">
          Unicode Character Explorer
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {filteredGlyphs.length} glyphs
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search glyphs, names, or codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-neutral-500/20 rounded-sm outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors bg-white dark:bg-neutral-800/20 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 text-sm font-medium rounded-sm border transition-all ${
            selectedCategory === "all"
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-400"
          }`}
        >
          All Categories
        </button>

        {Object.entries(glyphCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 text-sm font-medium rounded-sm border transition-all ${
              selectedCategory === key
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Character Chain Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={characterChain}
          onChange={(e) => setCharacterChain(e.target.value)}
          placeholder="Click glyphs to build a chain..."
          className="w-full px-4 py-3 pr-32 text-sm border border-gray-200 dark:border-neutral-500/20 rounded-sm outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors bg-white dark:bg-neutral-800/20 text-gray-900 dark:text-gray-100"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            onClick={clearChain}
            disabled={!characterChain}
            className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all ${
              characterChain
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Clear
          </button>
          <button
            onClick={copyChainToClipboard}
            disabled={!characterChain}
            className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all ${
              copiedChain
                ? "bg-green-500 text-white"
                : characterChain
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {copiedChain ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Special note for Zalgo characters */}
      {selectedCategory === "zalgo" && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-sm border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">
                Zalgo / Combining Characters
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                These are combining diacritical marks that stack on top of other
                characters. Type a letter first, then paste the combining
                character after it. Example: a + ̀ = à
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glyphs Grid */}
      <div
        className={`grid gap-3 max-h-[600px] overflow-y-auto pr-2 ${
          categoryGridConfig[selectedCategory] ||
          "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
        }`}
      >
        {filteredGlyphs.map((glyph, index) => (
          <div
            key={`${glyph.code}-${index}`}
            onClick={() => handleGlyphClick(glyph)}
            className={`group relative p-4 rounded-sm border cursor-pointer transition-all text-center select-none ${
              copiedGlyph === glyph.char
                ? "bg-green-500 border-green-500 text-white"
                : "bg-neutral-500/5 border-neutral-500/10 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10"
            }`}
          >
            <div
              className={`${
                selectedCategory === "tableFlip"
                  ? "text-base sm:text-lg"
                  : "text-3xl"
              } mb-2 ${selectedCategory === "tableFlip" ? "font-mono" : ""}`}
            >
              {glyph.char}
            </div>
            <div className="text-[10px] opacity-60 overflow-hidden text-ellipsis whitespace-nowrap px-1">
              {glyph.name}
            </div>
            {copiedGlyph === glyph.char && (
              <div className="absolute top-1 right-1 text-[10px] font-bold">
                Copied!
              </div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[150px] shadow-lg">
              <div className="font-semibold mb-1 break-all">{glyph.char}</div>
              <div className="text-gray-300">{glyph.name}</div>
              <div className="text-gray-400 text-[10px] mt-1">{glyph.code}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredGlyphs.length === 0 && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-lg font-medium">No glyphs found</div>
          <div className="text-sm mt-1">
            Try a different search term or category
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          💡 Quick Tips
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-neutral-500/5 p-3 rounded-sm border border-neutral-500/10">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              HTML Usage
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Use as &amp;#x2192; for →
            </div>
          </div>
          <div className="bg-neutral-500/5 p-3 rounded-sm border border-neutral-500/10">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              CSS Usage
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              content: "\2192" for →
            </div>
          </div>
          <div className="bg-neutral-500/5 p-3 rounded-sm border border-neutral-500/10">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              JavaScript
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              String.fromCharCode(0x2192)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlyphsGrid;
