import osmnx as ox
import networkx as nx
import requests

G = ox.graph_from_place("Львів", network_type="drive")

def get_route_between(lon1, lat1, lon2, lat2, start_label=None, end_label=None):
    start_node = ox.distance.nearest_nodes(G, lon1, lat1)
    end_node = ox.distance.nearest_nodes(G, lon2, lat2)

    route_nodes = nx.astar_path(G, start_node, end_node, weight="length")

    route_coords = []

    for i, node in enumerate(route_nodes):
        coord = {"coords": [G.nodes[node]["x"], G.nodes[node]["y"]]}
        # Додаємо label лише якщо він існує
        if i == 0 and start_label is not None:
            coord["label"] = start_label
        if i == len(route_nodes) - 1 and end_label is not None:
            coord["label"] = end_label

        route_coords.append(coord)

    return route_coords

def compute_full_route(start, addresses):
    jobs = []
    for i, addr in enumerate(addresses):
        coords = geocode_address(addr, start["city"])
        jobs.append({
            "label": addr,
            "coords": coords
        })

    points = [start] + jobs

    full = []

    for i in range(len(points) - 1):
        segment = get_route_between(
            points[i]["coords"][0],
            points[i]["coords"][1],
            points[i+1]["coords"][0],
            points[i+1]["coords"][1],
            start_label=points[i]["label"],
            end_label=points[i+1]["label"]
        )

        # уникаємо дублювання останнього вузла
        if full:
            segment = segment[1:]

        full.extend(segment)

    return full

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

def geocode_address(addr, city):
    query = f"{addr}, {city}"
    res = requests.get(NOMINATIM_URL, params={
        "q": query,
        "format": "json",
        "limit": 1
    }, headers={"User-Agent": "logistics-app"})
    data = res.json()
    if not data:
        raise ValueError(f"Не вдалося знайти координати для: {addr}")
    loc = data[0]
    return [float(loc["lon"]), float(loc["lat"])]