import React from "react";
import { BlockMath } from "react-katex";

function Section({ head, body }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-medium">{head}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function Figure({ caption, children }) {
  return (
    <div className="flex flex-col gap-3">
      {children}
      <i className="text-center text-sm">{caption}</i>
    </div>
  );
}

function ImageRow({ images, className }) {
  return (
    <div className="flex flex-row justify-around">
      {images.map((src) => (
        <img className={className} src={"/images/" + src} />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="container mx-auto my-20 mb-48 flex max-w-5xl flex-col gap-16 text-gray-700">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">Chess Ray Tracer</h1>
        <i className="text-sm">CS 488 Final Project by Thomas Kou</i>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Texture mapping"
          body={
            "Texture mapping is implemented for all primitives supported by the renderer (spheres and boxes)."
          }
        />
        <ImageRow className="" images={["textures.png"]} />
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Bump/normal mapping"
          body={
            "Bump mapping is implemented for all primitives supported by the renderer (spheres and boxes)." +
            " Normal vectors are extracted from an image and transformed from tangent space into world space."
          }
        />
        <Figure caption="The same scene with the light source in two different places.">
          <ImageRow className="" images={["bump-1.png", "bump-2.png"]} />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Perlin noise"
          body={
            "Perlin noise is used to generate the marble texture on the chess board. We use a linear combination of noise" +
            " sourced from randomly-filled grids of size 128×128, 64×64, 32×32, and 16×16. This noise is then fed back into" +
            " the input of a periodic function that generates a shade between black and white; this causes the output to" +
            " distort the bands into turbulent waves."
          }
        />
        <div className="flex flex-col gap-3">
          <ImageRow className="max-h-60" images={["perlin-graph.png"]} />
          <BlockMath math="\frac{2}{1+\big|\sin(\pi x)\big|}-1" />
        </div>
        <ImageRow
          className="max-h-60"
          images={[
            "perlin-1.png",
            "perlin-2.png",
            "perlin-3.png",
            "perlin-4.png",
          ]}
        />
        <ImageRow
          className="max-h-60"
          images={[
            "perlin-5.png",
            "perlin-6.png",
            "perlin-7.png",
            "perlin-8.png",
          ]}
        />
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Refraction"
          body={
            "Materials can now specify an index of refraction, as well as an alpha (opacity) value that determines" +
            " how much of the light is transmitted and how much is reflected."
          }
        />
        <Figure caption="Refraction indices of 1.0, 1.15, and 1.6. Alpha of 0.2.">
          <ImageRow className="" images={["refraction.png"]} />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Glossy reflection"
          body={
            "The Phong exponent is used to compute the glossiness of a material by perturbing a reflected ray by a" +
            " random polar and azimuthal angle. Multiple perturbed rays are reflected and averaged to compute the" +
            " final shade. A custom function is used to adaptively determine how many rays should be sampled based" +
            " on the magnitude of the Phong exponent. This function is:"
          }
        />
        <BlockMath math="\left\lfloor \frac{R}{\ln\left(\frac{p+10}{4}\right)} \right\rfloor + 1" />
        <p>
          where R is a user-specified parameter called the reflection sample
          factor. A higher factor will lead to more rays being shot per
          reflection.
        </p>
        <Figure caption="Graph of the above function for different values of R (10, 20, 50, and 100).">
          <ImageRow
            className="max-h-80"
            images={["glossy-reflection-graph.png"]}
          />
        </Figure>
        <Figure caption="Phong exponents of 1, 5, and 100. Reflection sample factor of 16.">
          <ImageRow className="" images={["glossy-reflection.png"]} />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Uniform spatial subdivision"
          body={
            "As an optimization, the scene is uniformly divided into a grid of voxels, and reach ray steps through" +
            " the grid of voxels one at a time. At each voxel, we only compute the intersection of the ray with all" +
            " of the objects within that voxel (if any exist), ultimately reducing the overall number of intersections" +
            " that need to be calculated."
          }
        />
        <Figure caption="Grid renders with voxel size of 1.0, 3.0, and 8.0, as well as the scene itself.">
          <ImageRow
            className="max-h-60"
            images={[
              "uniform-scene.png",
              "uniform-1.png",
              "uniform-3.png",
              "uniform-8.png",
            ]}
          />
        </Figure>
        <Figure caption="Render time comparison with a voxel size of 16.0.">
          <ImageRow
            className="max-h-80"
            images={["archive-13-grid.png", "uniform-graph.png"]}
          />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Non-adaptive anti aliasing"
          body={
            "Non-adaptive anti aliasing is achieved through supersampling. Each pixel is further sub-divided into an" +
            " N × N grid, and a ray is shot through each subdivision. The computed colours are then averaged to obtain" +
            " the final shade for the pixel."
          }
        />
        <Figure caption="No supersampling vs. 3x3 supersampling.">
          <ImageRow className="" images={["aa-1.png", "aa-3.png"]} />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Soft shadows"
          body={
            "Soft shadows are achieved when a light source inhabits an area, rather than a single point in space." +
            " At an intersection, multiple shadow rays are shot towards a randomly-sampled distribution of points across" +
            " the area of the light. To simplify computation, lights are assumed to be spherical, and shadow rays are shot" +
            " towards a uniform distribution of points within the sphere. To support this, lights can now specify a radius" +
            " within the modeling language."
          }
        />
        <Figure caption="Point light vs. area light with 20 shadow rays per intersection.">
          <ImageRow
            className=""
            images={["shadows-hard.png", "shadows-soft12.png"]}
          />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="Depth of field"
          body={
            "When rendering a scene, we specify the camera's eye and view vectors. To support depth of field, the renderer" +
            " now additionally supports an aperture size (diameter), and the focal distance is assumed to be the norm of the" +
            " view vector. Before shooting each ray, the origin of the ray is randomly perturbed within the aperture area" +
            " while keeping the focal point the same. Multiple rays are then shot and averaged."
          }
        />
        <Figure caption="Depth of field comparison with an aperture width of 1.2 and 12 samples per pixel.">
          <ImageRow
            className="max-h-80"
            images={["dof-none.png", "dof-near.png", "dof-far.png"]}
          />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="(BONUS) Multithreading"
          body={
            "The C++ <thread> library is used to parallelize the rendering workload. Each pixel on the final image is handled" +
            " by one of N threads, where N is the number of hardware threads supported by the system."
          }
        />
        <ImageRow
          className="max-h-80"
          images={["archive-01-models.png", "multithreading-graph.png"]}
        />
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="(BONUS) Glossy refraction"
          body={
            "Like glossy reflection, a custom function is used to adaptively determine how many perturbed refraction rays" +
            " should be sampled based on the magnitude of the Phong exponent."
          }
        />
        <Figure caption="Refraction indices of 1.0, 1.15, and 1.6. Alpha of 0.2. Phong exponent of 50. Refraction sample factor of 16.">
          <ImageRow className="" images={["glossy-refraction.png"]} />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="(BONUS) Phong shading"
          body={
            "Phong shading is supported for meshes by using barycentric coordinates to interpolate vertex normals at each" +
            " face of the mesh. This required modifying the .obj file parser to read and store vertex normals, as well as" +
            " the normal indices for each face."
          }
        />
        <Figure caption="An evil monkey and a smooth evil monkey.">
          <ImageRow className="" images={["phong-off.png", "phong-on.png"]} />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="(BONUS) Sky sphere"
          body={
            "Much like texture mapping on spherical primitives, we can use spherical coordinates to map the direction of" +
            " a ray to u, v coordinates for use in an image texture. The resulting spherical skybox is used for rays that" +
            " do not intersect any object in the scene."
          }
        />
        <Figure caption="Playing chess in different environments!">
          <ImageRow
            className="max-h-80"
            images={["sky-1.png", "sky-2.png", "sky-3.png"]}
          />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section
          head="(BONUS) FEN reader"
          body={
            "FEN is a standard format that encodes a unique chess position. The lua file that specifies the scene can" +
            " easily parse FEN formats, allowing for automatic specifications of different chess positions without having" +
            " to manually adjust the coordinates and transformations of all of the pieces."
          }
        />
        <Figure caption="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR">
          <ImageRow
            className="max-h-80"
            images={["fen-1-lichess.png", "fen-1.png"]}
          />
        </Figure>
        <Figure caption="r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1">
          <ImageRow
            className="max-h-80"
            images={["fen-2-lichess.png", "fen-2.png"]}
          />
        </Figure>
        <Figure caption="8/2n2r2/2k2q2/2p2b2/8/1Q4N1/2B2P2/3KR3">
          <ImageRow
            className="max-h-80"
            images={["fen-3-lichess.png", "fen-3.png"]}
          />
        </Figure>
      </div>
      <div className="flex flex-col gap-5">
        <Section head="Final scene" body={null} />
        <ImageRow className="" images={["final.png"]} />
      </div>
    </div>
  );
}

export default App;
