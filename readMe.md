

# Reducing the Memory Footprint of 3D Gaussian Splatting: Web Viewer
Original work by: Panagiotis Papantonakis Georgios Kopanas, Bernhard Kerbl, Alexandre Lanvin, George Drettakis<br>
| [Webpage](https://repo-sam.inria.fr/fungraph/reduced_3dgs/) | [Full Paper](https://repo-sam.inria.fr/fungraph/reduced_3dgs/reduced_3DGS_i3d.pdf) | [Datasets (TODO)](TODO) | [Video](https://youtu.be/EnKE-d7eMds?si=xWElEPf4JgwOAmbB&t=48) | [Other GRAPHDECO Publications](http://www-sop.inria.fr/reves/publis/gdindex.php) | [FUNGRAPH project page](https://fungraph.inria.fr) | <br>

Re-written by: Jesús Bertani Ramírez

This repository contains a re-written version of the web viewer developed by the authors of the paper, which can be found [here](https://repo-sam.inria.fr/fungraph/reduced_3dgs/), to visualize their new Quantized Gaussians. This was made in order to better understand how the renderer works and to allow anyone to easily understand it.


Given that it was made for the paper, it only parses PLY/SPLAT files with their Quantized Gaussians or files that contains the original 3DGS model but only if they have Spherical Harmonics of degree 3.


The vertex shader used in this implementation accepts gaussians with Spherical Harmonics of degree 0, 1, 2 and 3 so the next step is to make use of this. Also, this implementation uses WebAssembly to sort the gaussians before rendering so it would be great to see this techonology used in other renderers.
