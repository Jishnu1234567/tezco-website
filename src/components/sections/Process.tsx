"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TECH_ICONS = [
  { label: "React",      color: "#61DAFB", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09c.278 0 .51.06.69.168.818.47 1.087 2.817.52 5.985a20.416 20.416 0 0 0-.477-.09 20.758 20.758 0 0 0-.096-4.814c-.127-.59-.308-1.086-.516-1.435-.163-.274-.334-.447-.505-.511a.76.76 0 0 0-.286-.048c-.728 0-1.9.527-3.26 1.602A20.11 20.11 0 0 0 12 5.145a20.11 20.11 0 0 0-1.914 1.325c-1.36-1.075-2.53-1.602-3.26-1.602a.76.76 0 0 0-.287.048c-.82.298-1.29 1.573-1.29 3.47 0 .607.058 1.266.175 1.958a20.416 20.416 0 0 0-.476.09C1.9 10.01 1 11.074 1 12.004c0 .93.9 1.994 2.948 2.569.152.044.306.086.476.126-.114.69-.17 1.35-.17 1.955 0 1.897.47 3.172 1.29 3.47.82.298 2.18-.2 3.547-1.35a20.11 20.11 0 0 0 1.914 1.325 20.11 20.11 0 0 0 1.914-1.325c1.368 1.15 2.727 1.648 3.547 1.35.82-.298 1.29-1.573 1.29-3.47 0-.606-.056-1.265-.17-1.955.17-.04.324-.082.476-.126C22.1 13.998 23 12.934 23 12.004c0-.93-.9-1.994-2.948-2.569a20.758 20.758 0 0 0-.477-.09c.116-.692.173-1.35.173-1.958 0-1.897-.47-3.172-1.29-3.47a.76.76 0 0 0-.287-.048z"/></svg>` },
  { label: "Next.js",    color: "#ffffff", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/></svg>` },
  { label: "TypeScript", color: "#3178C6", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>` },
  { label: "Tailwind",   color: "#06B6D4", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>` },
  { label: "Node.js",    color: "#5FA04E", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.605.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.084.05-.139.144-.139.243v10.148c0 .097.055.191.137.237l2.409 1.391c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.943-.922-1.604V6.921c0-.661.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15c0 .661-.354 1.275-.924 1.604l-8.794 5.078c-.28.162-.6.247-.925.247zm2.718-7.003c-3.853 0-4.662-1.769-4.662-3.254 0-.142.114-.253.256-.253h1.138c.127 0 .233.091.252.215.172 1.161.686 1.747 3.016 1.747 1.855 0 2.645-.42 2.645-1.405 0-.568-.225-.99-3.114-1.273-2.416-.238-3.908-.77-3.908-2.7 0-1.778 1.499-2.838 4.013-2.838 2.823 0 4.222.98 4.4 3.088.006.07-.019.138-.065.189a.252.252 0 0 1-.185.081h-1.143a.25.25 0 0 1-.247-.205c-.276-1.224-.946-1.616-2.76-1.616-2.033 0-2.27.708-2.27 1.238 0 .643.28.83 3.02 1.193 2.708.36 4.001.87 4.001 2.765 0 1.917-1.598 3.028-4.387 3.028z"/></svg>` },
  { label: "PostgreSQL", color: "#4169E1", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C11.422.238 10.41.524 9.594 1 8.79.721 7.122.24 5.364.336 4.24.403 2.986.727 2.03 1.661.833 2.82.214 4.601.5 6.868c.09.71.271 1.374.56 1.962a3.174 3.174 0 0 0-.085.779c.007.701.183 1.401.392 2.062.392 1.24.93 2.41 1.835 3.087.69.516 1.46.773 2.182.773.316 0 .63-.052.926-.16.378-.14.7-.374.979-.651.137.12.282.23.44.322 1.17.69 2.755.627 3.879.01a4.272 4.272 0 0 0 .441-.324c.28.28.605.517.988.657.3.11.617.161.934.161.722 0 1.492-.257 2.182-.773.905-.677 1.443-1.847 1.835-3.087.21-.661.386-1.361.392-2.062a3.215 3.215 0 0 0-.083-.778c.288-.589.47-1.252.56-1.962.285-2.267-.334-4.048-1.53-5.207C20.68.656 19.05.164 17.807.114A8.027 8.027 0 0 0 17.128 0z"/></svg>` },
  { label: "Redis",      color: "#FF4438", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.9 4.8L7.5 6.4l3.4 1.6 3.4-1.6-3.4-1.6zm-4.9 2.3l3.4 1.6v3.2L6 10.3V7.1zm4.9 4.8l-3.4-1.6v3.2l3.4 1.6 3.4-1.6v-3.2l-3.4 1.6zm4.9-3.2L12.3 10v3.2l3.5-1.6V7.7zM0 2.7v18.6L12 24l12-2.7V2.7L12 0 0 2.7zm21.8 15.5L12 20.4l-9.8-2.2V4.7L12 2.5l9.8 2.2v13.5z"/></svg>` },
  { label: "Docker",     color: "#2496ED", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>` },
  { label: "AWS",        color: "#FF9900", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/></svg>` },
  { label: "GraphQL",    color: "#E10098", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.051 2.751l4.935 2.85c.816-.859 2.173-.893 3.032-.077.859.816.893 2.173.077 3.032-.245.258-.552.446-.889.543v5.701c1.138.341 1.784 1.553 1.443 2.691-.341 1.138-1.553 1.784-2.691 1.443-.648-.194-1.155-.701-1.349-1.349H6.391c-.341 1.138-1.553 1.784-2.691 1.443-1.138-.341-1.784-1.553-1.443-2.691.194-.648.701-1.155 1.349-1.349V9.1c-1.138-.341-1.784-1.553-1.443-2.691.341-1.138 1.553-1.784 2.691-1.443.337.101.644.289.889.547l4.935-2.85c-.208-1.173.575-2.294 1.748-2.502 1.173-.208 2.294.575 2.502 1.748.037.204.037.413 0 .617zm-2.051.904l-5.015 2.896c.032.218.032.44 0 .658L12 10.789l5.015-2.896c-.032-.218-.032-.44 0-.658L12 4.339zm5.985 5.825L13 13.06v5.791c.196.07.38.165.543.283l4.935-2.85c-.054-.193-.084-.394-.084-.598 0-.762.411-1.469 1.077-1.849V9.1c-.384-.115-.727-.32-1.007-.595zM6.015 10.164c-.28.275-.623.48-1.007.595v4.737c1.138.341 1.784 1.553 1.443 2.691l-.022.068 4.935 2.85c.163-.118.347-.213.543-.283v-5.791l-4.985-2.896c-.217.143-.588.215-.907.029zm.953-3.626l4.985 2.877 4.985-2.877c-.216-.191-.386-.431-.494-.7H7.462c-.108.269-.278.509-.494.7z"/></svg>` },
  { label: "Python",     color: "#3776AB", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>` },
  { label: "Vite",       color: "#646CFF", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0l10.594 18.489L24 0h-4.703L10.594 13.011 4.703 0H0z"/><path d="M10.594 18.489L0 0h4.703L10.594 13.011 20.297 0 24 0 10.594 18.489z" opacity=".7"/></svg>` },
  { label: "Firebase",   color: "#FFCA28", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z"/></svg>` },
  { label: "Rust",       color: "#CE422B", svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.634 11.945l-1.008-.623a13.44 13.44 0 0 0-.023-.29l.866-.76a.232.232 0 0 0-.063-.382l-1.094-.45a12.959 12.959 0 0 0-.07-.286l.712-.89a.232.232 0 0 0-.126-.368l-1.157-.27a13.37 13.37 0 0 0-.114-.272l.545-1.003a.232.232 0 0 0-.185-.343l-1.188-.083a12.75 12.75 0 0 0-.156-.251l.366-1.094a.232.232 0 0 0-.239-.308l-1.185.105a12.698 12.698 0 0 0-.195-.225l.18-1.152a.232.232 0 0 0-.288-.264l-1.148.29a12.655 12.655 0 0 0-.229-.196l-.013-1.162a.232.232 0 0 0-.329-.211l-1.08.47a12.703 12.703 0 0 0-.258-.162L16.43.953a.232.232 0 0 0-.36-.148l-.99.641a12.64 12.64 0 0 0-.282-.124L14.617.19a.232.232 0 0 0-.382.079l-.877.803a12.817 12.817 0 0 0-.3-.083l-.53-1.059a.232.232 0 0 0-.394 0l-.53 1.059a12.817 12.817 0 0 0-.3.083L10.428.12a.232.232 0 0 0-.382-.079l-.48 1.132a12.64 12.64 0 0 0-.282.124l-.99-.641a.232.232 0 0 0-.36.148l-.37 1.148a12.703 12.703 0 0 0-.258.162l-1.08-.47a.232.232 0 0 0-.329.211l-.013 1.162a12.655 12.655 0 0 0-.229.196l-1.148-.29a.232.232 0 0 0-.288.264l.18 1.152a12.698 12.698 0 0 0-.195.225L3.02 4.664a.232.232 0 0 0-.239.308l.366 1.094a12.75 12.75 0 0 0-.156.251l-1.188.083a.232.232 0 0 0-.185.343l.545 1.003a13.37 13.37 0 0 0-.114.272l-1.157.27a.232.232 0 0 0-.126.368l.712.89a12.959 12.959 0 0 0-.07.286l-1.094.45a.232.232 0 0 0-.063.382l.866.76a13.44 13.44 0 0 0-.023.29l-1.008.623a.232.232 0 0 0 0 .394l1.008.623c.007.097.015.194.023.29l-.866.76a.232.232 0 0 0 .063.382l1.094.45c.023.096.046.191.07.286l-.712.89a.232.232 0 0 0 .126.368l1.157.27c.037.091.075.182.114.272l-.545 1.003a.232.232 0 0 0 .185.343l1.188.083c.05.085.102.169.156.251l-.366 1.094a.232.232 0 0 0 .239.308l1.185-.105c.063.077.129.151.195.225l-.18 1.152a.232.232 0 0 0 .288.264l1.148-.29c.074.067.151.133.229.196l.013 1.162a.232.232 0 0 0 .329.211l1.08-.47c.084.055.17.109.258.162l.37 1.148a.232.232 0 0 0 .36.148l.99-.641c.092.043.186.084.282.124l.48 1.132a.232.232 0 0 0 .382.079l.877-.803c.099.028.199.056.3.083l.53 1.059a.232.232 0 0 0 .394 0l.53-1.059c.101-.027.201-.055.3-.083l.877.803a.232.232 0 0 0 .382-.079l.48-1.132c.096-.04.19-.081.282-.124l.99.641a.232.232 0 0 0 .36-.148l.37-1.148a12.703 12.703 0 0 0 .258-.162l1.08.47a.232.232 0 0 0 .329-.211l.013-1.162c.078-.063.155-.129.229-.196l1.148.29a.232.232 0 0 0 .288-.264l-.18-1.152c.066-.074.132-.148.195-.225l1.185.105a.232.232 0 0 0 .239-.308l-.366-1.094c.054-.082.106-.166.156-.251l1.188-.083a.232.232 0 0 0 .185-.343l-.545-1.003c.039-.09.077-.181.114-.272l1.157-.27a.232.232 0 0 0 .126-.368l-.712-.89c.024-.095.047-.19.07-.286l1.094-.45a.232.232 0 0 0 .063-.382l-.866-.76c.008-.096.016-.193.023-.29l1.008-.623a.232.232 0 0 0 0-.394zM12 16.847a4.847 4.847 0 1 1 0-9.694 4.847 4.847 0 0 1 0 9.694z"/></svg>` },
];

// ─── Marquee row — zero JS, pure CSS transform, GPU only ─────────────────────
// Renders icons TWICE. Keyframe shifts exactly -50% → second set snaps
// invisibly to position 0. Works on every screen width, no stutter.
const MarqueeRow = React.memo(({ reversed, duration }: { reversed: boolean; duration: string }) => {
  const icons = reversed ? [...TECH_ICONS].reverse() : TECH_ICONS;
  const cls   = reversed ? "mq-rev" : "mq-fwd";

  return (
    <div
      className="relative overflow-hidden py-2"
      style={{
        WebkitMaskImage: "linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%)",
        maskImage:       "linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%)",
      }}
    >
      <div className={`${cls} flex`} style={{ width: "max-content", animationDuration: duration }}>
        {[0, 1].map(copy =>
          icons.map((item, i) => (
            <div key={`${copy}-${i}`} className="flex items-center gap-2 mx-3 md:mx-4 shrink-0 group cursor-default">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.04] group-hover:border-white/25 group-hover:bg-white/10 transition-colors duration-300">
                <span
                  style={{ color: item.color, width: 16, height: 16, display: "inline-flex", alignItems: "center", flexShrink: 0 }}
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                  aria-hidden
                />
                <span className="font-semibold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap" style={{ fontSize: "clamp(8px,1vw,11px)" }}>
                  {item.label}
                </span>
              </div>
              <span className="text-white/10 text-[8px] select-none">◆</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
MarqueeRow.displayName = "MarqueeRow";

export default function ModernEffectsPage() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const roadRef       = useRef<HTMLDivElement>(null);
  const [progress,    setProgress]    = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  const sliderData = [
    { title: "Minimal UI",    sub: "Precision", desc: "Clean interfaces designed to reduce cognitive load.",    img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop" },
    { title: "Smart UX",      sub: "Intuitive", desc: "Architecting seamless user journeys that feel natural.", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&fit=crop" },
    { title: "Motion Design", sub: "Dynamics",  desc: "Purposeful animations that guide users.",               img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&fit=crop" },
    { title: "Grid Systems",  sub: "Structure", desc: "Mathematical layouts ensuring perfect scalability.",     img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&fit=crop" },
  ];

  // Loader
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); setTimeout(() => setIsLoading(false), 400); return 100; }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  // Road parallax
  useEffect(() => {
    if (isLoading) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (roadRef.current) {
          roadRef.current.style.height = `${Math.max(0, window.innerHeight - window.scrollY * 1.5)}px`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, [isLoading]);

  const changeSlide = useCallback((dir: number) => {
    setActiveIndex(p => (p + dir + sliderData.length) % sliderData.length);
  }, [sliderData.length]);

  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) changeSlide(dx > 0 ? 1 : -1);
  };

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white overflow-x-hidden" style={{ fontFamily: "'Archivo',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url("https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;800;900&display=swap");

        /* ─ Seamless loop: animate exactly -50% of the doubled track ─ */
        @keyframes mq-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes mq-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* GPU-composited: only transform touches the layer ─ no repaints */
        .mq-fwd, .mq-rev {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .mq-fwd { animation: mq-fwd linear infinite; }
        .mq-rev { animation: mq-rev linear infinite; }

        @media (hover: hover) {
          .mq-fwd:hover, .mq-rev:hover { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mq-fwd, .mq-rev { animation: none !important; }
        }

        .clip-path-road { clip-path: polygon(48% 0%,52% 0%,100% 100%,0% 100%); }
        .slide-3d { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease; }
      `}} />

      {/* LOADER */}
      {isLoading && (
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col justify-end p-6 md:p-10 overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-black"
            style={{ width: `${progress}%`, transition: "width 60ms linear" }} />
          <span className="relative z-10 font-black leading-none tracking-tighter select-none"
            style={{ fontSize: "clamp(72px,22vw,220px)", color: progress < 50 ? "#000" : "#fff", transition: "color 0.3s" }}>
            {Math.round(progress)}%
          </span>
        </div>
      )}

      {/* HERO */}
      <section className="h-screen flex flex-col justify-end items-center relative overflow-hidden bg-black">
        <div className="flex flex-col items-center justify-end w-full h-full">
          <div className="bg-white rounded-t-full mix-blend-difference"
            style={{ width: "clamp(180px,75%,580px)", height: "clamp(90px,18vw,280px)" }} />
          <div className="w-full h-px bg-white" />
        </div>
        <div ref={roadRef} className="clip-path-road bg-white mix-blend-difference absolute bottom-0 w-full"
          style={{ height: "100vh", willChange: "height" }} />
      </section>

      {/* PART 1 */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-10 min-h-screen relative overflow-hidden">
        <h2 className="fixed top-10 left-0 font-black mix-blend-difference text-white pointer-events-none leading-none whitespace-nowrap select-none"
          style={{ fontSize: "clamp(56px,13vw,180px)", opacity: 0.07, zIndex: 0 }}>TEZCO FLOW</h2>
        <div className="mt-[40vh] md:mt-[20vw] space-y-1 md:space-y-3 text-right relative z-10">
          {["BUILD BY", "TECHNICAL", "EXPERTS"].map(t => (
            <h3 key={t} className="font-black text-black uppercase"
              style={{ fontSize: "clamp(32px,9vw,110px)", lineHeight: 0.78 }}>{t}</h3>
          ))}
        </div>
      </section>

      {/* 3D SLIDER */}
      <div
        className="bg-black min-h-screen flex items-center justify-center overflow-hidden relative py-16 md:py-24"
        style={{ touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-8 z-50 pointer-events-none">
          {([[-1, ChevronLeft], [1, ChevronRight]] as [number, React.ElementType][]).map(([dir, Icon]) => (
            <button key={dir} onClick={() => changeSlide(dir)}
              className="pointer-events-auto p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 active:scale-95 transition-all">
              <Icon size={22} className="text-white" />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-10 w-full overflow-visible px-4">
          {sliderData.map((card, i) => {
            const off    = i - activeIndex;
            const active = off === 0;
            return (
              <div key={i}
                onClick={() => !active && changeSlide(off > 0 ? 1 : -1)}
                className={`slide-3d relative shrink-0 cursor-pointer ${Math.abs(off) > 1 ? "hidden md:block" : "block"}`}
                style={{
                  width: "clamp(190px,50vw,300px)",
                  height: "clamp(280px,65vw,460px)",
                  transform: `perspective(1100px) translateX(${off * 55}px) rotateY(${off * -32}deg) scale(${active ? 1.08 : 0.76})`,
                  opacity: Math.abs(off) > 1 ? 0 : 1,
                  zIndex: active ? 30 : 20 - Math.abs(off),
                  willChange: "transform",
                }}
              >
                <div className={`w-full h-full rounded-3xl overflow-hidden border ${active ? "border-white/40" : "border-white/10"} shadow-2xl`}>
                  <img src={card.img} alt={card.title} loading="eager"
                    className={`w-full h-full object-cover transition-all duration-700 ${active ? "scale-110 brightness-75" : "scale-100 brightness-50"}`} />
                </div>
                {active && (
                  <div className="absolute z-40 p-4 md:p-6 backdrop-blur-xl bg-black/65 rounded-2xl border border-white/10 shadow-2xl"
                    style={{ bottom: "-16px", left: "clamp(-6px,-2vw,-32px)", minWidth: "clamp(150px,65%,300px)" }}>
                    <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[9px] mb-1">{card.sub}</p>
                    <h4 className="font-black text-white uppercase leading-none mb-2"
                      style={{ fontSize: "clamp(16px,4.5vw,32px)" }}>{card.title}</h4>
                    <p className="text-white/65 leading-relaxed font-light"
                      style={{ fontSize: "clamp(10px,1.8vw,12px)" }}>{card.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
          {sliderData.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)}
              className="h-2 rounded-full transition-all"
              style={{ width: i === activeIndex ? 20 : 8, background: i === activeIndex ? "#22d3ee" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>

      {/* MARQUEE SECTION */}
      <section className="bg-[#050505] py-20 md:py-32 overflow-hidden">
        <div className="px-6 md:px-16 mb-16 md:mb-24">
          <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold mb-4">What we do</p>
          <h2 className="font-black leading-none tracking-tighter" style={{ fontSize: "clamp(42px,11vw,140px)" }}>
            <span className="text-white">TEZCO HERE TO </span>
            <span style={{ background: "linear-gradient(135deg,#38bdf8 0%,#2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              HELP YOU
            </span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-xl leading-relaxed" style={{ fontSize: "clamp(13px,1.6vw,17px)" }}>
            From architecture to deployment — we engineer digital experiences that are fast, scalable, and built to last.
          </p>
        </div>

        <div className="w-full h-px bg-white/5 mb-8" />

        <MarqueeRow reversed={false} duration="32s" />
        <div className="h-3" />
        <MarqueeRow reversed={true}  duration="26s" />
      </section>
    </div>
  );
}