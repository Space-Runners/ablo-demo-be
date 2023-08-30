export const styleMap = {
  kidult: 'Kidult',
  deco: 'Deco',
  origami: 'Origami',
  mixed_media: 'Mixed Media',
  collage: 'Collage',
  botanical: 'Botanical',
  pop_stained_glass: 'Pop Stained Glass',
  line_art: 'Line Art',
  vintage_poster: 'Vintage Poster',
  graffiti: 'Graffiti',
};

export function styles(
  key = 'botanical',
  input: string,
  mood: string,
  background: string,
) {
  key = key.toLowerCase();
  const options = {
    vintage_poster: {
      text_prompt: [
        {
          text: `(${input}) in style of Roger Broders, Otto Baumberger, Percy Trompf, Gert Sellheim vintage american poster, retro, uncutted, entire object, in center of frame, center composition, isolated object on bg, uncropped, single object, unclipped image, ${mood} ${background}`,
          weight: 80,
        },
        {
          text: 'watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -100,
        },
      ],
      engineId: 'stable-diffusion-512-v2-1',
      cfg_scale: 10,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 50,
      style_preset: 'tile-texture',
      sampler: 'K_LMS',
    },
    botanical: {
      text_prompt: [
        {
          text: `(${input}) in style of Charles Willson Peale, engraving, vintage, ink wash collages, naturalistic depictions, detailed studies, illustration with annotations, translucent, delicate, detailed, elegant, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 50,
        },
        {
          text: 'frame, human face, watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-v1-5',
      cfg_scale: 10,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 110,
      style_preset: 'enhance',
      sampler: 'K_LMS',
    },
    kidult: {
      text_prompt: [
        {
          text: `(${input}) in style of simple drawing, color, Childish Naive Preschool Colorful Cute Drawings, children drawing, 2d art, cute childlike, black strokes, naive art, primitivism, uncropped, logo, whole object in frame, straight, entire shape, center composition with clean bg, ((clean bg)), entire object, (((in center of frame))), minimalistic, isolated object, (((flat bg))), (((single object))), unclipped image, ${mood} ${background}`,
          weight: 60,
        },
        {
          text: `bw, realism, photo, 3d, (((out of frame))), (((crop details))), blur, blurring, watermark, text, signature, illustration, (((blurred))), complex background, detailed background, vertical image, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, ((pattern))`,
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-v1-5',
      cfg_scale: 9,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 50,
      style_preset: 'enhance',
      sampler: 'K_LMS',
    },
    line_art: {
      text_prompt: [
        {
          text: `(${input}) in style of Christopher Wool, line art, John Mckinstry, uncropped, entire shape, center composition with clean bg, bw, ink, isolated object, stroke only, graphite realism, graphite sketching, detailed sketching, style moebius, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 50,
        },
        {
          text: '3d, watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-512-v2-1',
      cfg_scale: 9,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 100,
      style_preset: 'line-art',
      sampler: 'K_LMS',
    },
    mixed_media: {
      text_prompt: [
        {
          text: `(${input}) art by Virtual Reality Art, collage by children, rough, sketch, uncropped, entire shape, center composition with clean bg, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 50,
        },
        {
          text: 'ugly, poor quality, watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-512-v2-1',
      cfg_scale: 8,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 60,
      style_preset: '',
      sampler: 'K_LMS',
    },
    origami: {
      text_prompt: [
        {
          text: `(${input}) art by origami, craft, paper, single object, unclipped image, ${mood} ${background}`,
          weight: 70,
        },
        {
          text: 'ugly, poor quality, watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-512-v2-1',
      cfg_scale: 7,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 100,
      style_preset: '',
      sampler: '',
    },
    deco: {
      text_prompt: [
        {
          text: `(${input}) art by William Morris, Art Nouveau, design, book graphic, flowers, leaves, graphic novels, illustration, graphic design, graphic, pov front, solo, single, uncropped picture, uncropped, entire shape, center composition with clean bg, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 70,
        },
        {
          text: '3d, watermark, text, signature, blurred, blur, blurred, blurring, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-512-v2-1',
      cfg_scale: 8,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 50,
      style_preset: '',
      sampler: '',
    },
    graffiti: {
      text_prompt: [
        {
          text: `(${input}) in style of graffiti, concept graffiti street art, no jagged lines, andy warhol, t shirt design, concept art, spray, pop art, digital painting, neo-expressionism, uncropped, entire shape, center composition with clean bg, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 50,
        },
        {
          text: 'watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-512-v2-1',
      cfg_scale: 18,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 29,
      style_preset: '',
      sampler: 'K_LMS',
    },
    collage: {
      text_prompt: [
        {
          text: `${input} in style of paper collage, made of paper, 2d, color paper, rough, uncropped, entire shape, center composition with clean bg, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 20,
        },
        {
          text: '3d, frame, watermark, text, signature, boring, plain, blurred, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, multiple views, multiple angles, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-v1-5',
      cfg_scale: 6,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 100,
      style_preset: 'digital-art',
      sampler: 'K_LMS',
    },
    pop_stained_glass: {
      text_prompt: [
        {
          text: `${input} in style of Romero Britto, flat shapes, vitrage, stained glass, geometric, uncropped, entire shape, center composition with clean bg, entire object, in center of frame, isolated object on bg, single object, unclipped image, ${mood} ${background}`,
          weight: 50,
        },
        {
          text: 'watermark, text, signature, blurred, picture-frame, uninscribed, text font ui, Images cut out at the top, left, right, bottom, watermark, text, username, signature, frame, blurry image, crop, cropped, homogenous, unattractive, opaque, grains, grainy, portrait, lowres, low quality, out of frame, multiple views, multiple angles, duplicate, batch, cut, jpeg artifacts, morbid, tiled, pattern',
          weight: -70,
        },
      ],
      engineId: 'stable-diffusion-v1-5',
      cfg_scale: 19,
      clip_guidance_preset: '',
      height: 512,
      width: 512,
      samples: 3,
      steps: 40,
      style_preset: 'enhance',
      sampler: 'K_LMS',
    },
  };

  return options[key];
}

export const moodMap = {
  energy: 'Energy',
  love: 'Love',
  doomsday: 'Doomsday',
  joy: 'Joy',
  bloom: 'Bloom',
  neon: 'Neon',
  cool: 'Cool',
  mystery: 'Mystery',
  pastel: 'Pastel',
  psychedelic: 'Psychedelic',
};

export const moods = {
  energy: 'bright red, hot red, electric red, saturated color',
  love: 'light pink, pale pink, pastel pink',
  doomsday: 'desert color, dusty orange, brown color, deep orange',
  joy: 'yellow, middle yellow, bright yellow, vivid yellow',
  bloom:
    'spring tones, fresh green, spring green, spring-inspired, sun-drenched',
  neon: 'neon lights, deep neon, cyan, purple, green, night mood',
  cool: 'cool blue, ice-blue, deep blue, pale blue, sky blue, cerulean color',
  mystery:
    'indigo, blue Violet, dark violet, dark magenta, fuchsia, violet palette, purple color mood, deep violet, dark purple, deep, blue, deep green',
  pastel:
    'pastel colors, calming colors, peaceful, Mint colors, pale colors, grayish',
  psychedelic: 'psychedelic multicolored kaleidoscopic background',
};

// LineArt, VintagePoster, Botanical
export const tonesMap = {
  kidult: ['Bright Tones', 'Mid Tones', 'Soft Tones', 'B/W Tones'],
  mixed_media: ['Bright Tones', 'Mid Tones', 'Soft Tones', 'B/W Tones'],
  deco: ['Bright Tones', 'Mid Tones', 'Soft Tones', 'B/W Tones'],
  collage: ['Bright Tones', 'Mid Tones', 'Soft Tones', 'B/W Tones'],
  pop_stained_glass: ['Bright Tones', 'Mid Tones', 'Soft Tones', 'B/W Tones'],
  origami: ['Bright Tones', 'Mid Tones', 'B/W Tones'],
  graffiti: ['Bright Tones', 'Mid Tones', 'B/W Tones'],
  line_art: [],
  vintage_poster: [],
  botanical: [],
};

export const tonesValues = {
  'Bright Tones':
    'vivid shades, luminous hues, radiant colors, brilliant tones, intense pigments, vibrant shades, bold colors, eye-catching tones, saturated hues, dazzling tints',
  'Mid Tones':
    'middle values, intermediate tones, half tones, neutral shades, muted hues, balanced shades',
  'Soft Tones':
    'gentle shades, subdued hues, muted colors, delicate tints, pastel tones, pale shades, subtle colors, light hues, whispered tones, tender shades',
  'B/W Tones': 'monochrome, greyscale, noir, black-and-white, bw, tonal',
};

export const keywordMap = {
  vintage_poster: ['Fly agaric', 'Shark', 'Turtles', 'Butterflies', 'Palms'],
  botanical: ['Croco', 'Shark', 'Fly agaric'],
  kidult: ['Croco', 'Turtles', 'Butterflies', 'Dragon', 'Cactus'],
  line_art: ['Fly agaric', 'Turtles', 'Raven', 'Buffalo', 'Elephant'],
  mixed_media: ['Fly agaric', 'Tiger', 'Butterflies'],
  origami: ['Frog', 'Tiger', 'Buffalo'],
  deco: ['Fly agaric', 'Tiger', 'Butterflies'],
  graffiti: ['Fly agaric', 'Skull', 'Tiger', 'Motorbike'],
  collage: ['Frog', 'Skull', 'Croco'],
  pop_stained_glass: ['Frog', 'Fly agaric', 'Skull', 'Shark', 'Octopus'],
};

export const suggestions = {
  vintage_poster: [
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single',
    },
    {
      name: 'Shark',
      prompt:
        'shark, face, pov front solo, Jaws movie, open mouth, furious, single',
    },
    {
      name: 'Turtles',
      prompt: 'turtle, pov front, single',
    },
    {
      name: 'Butterflies',
      prompt: 'butterfly, pov front, solo, single',
    },
    {
      name: 'Palms',
      prompt: 'california, lovely palm, sun, pov front, solo, single',
    },
  ],
  botanical: [
    {
      name: 'Croco',
      prompt:
        'crocodile, face, head, flowers, pov front, solo, single, uncropped picture',
    },
    {
      name: 'Shark',
      prompt:
        'shark, face, pov front solo, Jaws movie, open mouth, furious, single, uncropped picture',
    },
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single, uncropped picture',
    },
  ],
  kidult: [
    {
      name: 'Croco',
      prompt:
        'crocodile, face, head, flowers, pov front, solo, single, uncropped picture',
    },
    {
      name: 'Turtles',
      prompt: 'turtle, pov front, single',
    },
    {
      name: 'Butterflies',
      prompt: 'butterfly, pov front, solo, single',
    },
    {
      name: 'Dragon',
      prompt: 'brontosaurus, dragon, myth, legend, fantasy, solo, single',
    },
    {
      name: 'Cactus',
      prompt: 'cactus, mexican',
    },
  ],
  line_art: [
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single',
    },
    {
      name: 'Turtles',
      prompt: 'turtle, pov front, single',
    },
    {
      name: 'Raven',
      prompt: 'raven, bird, face, side view',
    },
    {
      name: 'Buffalo',
      prompt: 'Geometric buffalo, face, head, solo, single',
    },
    {
      name: 'Elephant',
      prompt: '2d, ethnical elephant, face, head, single, solo',
    },
  ],
  mixed_media: [
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single',
    },
    {
      name: 'Tiger',
      prompt: 'solo, one tiger head and only facing front',
    },
    {
      name: 'Butterflies',
      prompt: 'butterfly, pov front, solo, single',
    },
  ],
  origami: [
    {
      name: 'Frog',
      prompt: 'frog, pov front, solo, single, uncropped picture',
    },
    {
      name: 'Tiger',
      prompt: 'one tiger head and only facing front',
    },
    {
      name: 'Buffalo',
      prompt: 'Geometric buffalo, face, head, solo, single',
    },
  ],
  deco: [
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single',
    },
    {
      name: 'Tiger',
      prompt: 'solo, one tiger head and only facing fron',
    },
    {
      name: 'Butterflies',
      prompt: 'butterfly, pov front, solo, single',
    },
  ],
  graffiti: [
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single',
    },
    {
      name: 'Skull',
      prompt: 'cartoon skull with mohawk, skeleton, solo, single',
    },
    {
      name: 'Tiger',
      prompt: 'solo, one tiger head and only facing fron',
    },
    {
      name: 'Motorbike',
      prompt:
        'motobike, Harley Davidson, pov front, solo, single, uncropped picture',
    },
  ],
  collage: [
    {
      name: 'Frog',
      prompt: 'frog, pov front, solo, single, uncropped picture',
    },
    {
      name: 'Skull',
      prompt: 'cartoon skull with mohawk, skeleton, solo, single',
    },
    {
      name: 'Croco',
      prompt:
        'crocodile, face, head, flowers, pov front, solo, single, uncropped picture',
    },
  ],
  pop_stained_glass: [
    {
      name: 'Frog',
      prompt: 'frog, pov front, solo, single, uncropped picture',
    },
    {
      name: 'Fly agaric',
      prompt: 'Fly agaric, mushrooms, fungus, solo, single',
    },
    {
      name: 'Skull',
      prompt: 'cartoon skull with mohawk, skeleton, solo, single',
    },
    {
      name: 'Shark',
      prompt:
        'shark, face, pov front solo, Jaws movie, open mouth, furious, single, uncropped picture',
    },
    {
      name: 'Octopus',
      prompt: 'octopus, single, uncropped picture',
    },
  ],
};
