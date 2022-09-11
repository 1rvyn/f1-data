"""Gear shifts on track
=======================

Plot which gear is being used at which point of the track
"""

##############################################################################
# Import FastF1 and load the data

import sys
import fastf1

import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
from matplotlib import cm
import numpy as np


# codion box dir
fastf1.Cache.enable_cache('/Users/irvyn/github-classroom/CM2104-DynamicWebDevelopment/cm2104-project-2122-group_f/final/python/cache')

s_input = sys.argv[1]
year = (s_input[0:4])
temp_wknd = (s_input[4:6])
# because if we have to have the weekend be a 2 digit number for slicing properly from just 1 string
# wknd = round (http://ergast.com/api/f1/2020) - example of rounds for the year 2020
if(temp_wknd[0:0] == 0):
    wknd = int(temp_wknd[1:1])
else:
    wknd = int(temp_wknd)
ses = s_input[6:7]
driver = str(s_input[7:10])

session = fastf1.get_session(year, wknd, ses)
laps = session.load_laps(with_telemetry=True)

lap = laps.pick_fastest()
tel = lap.get_telemetry()
# sphinx_gallery_defer_figures

##############################################################################
# Prepare the data for plotting by converting it to the appropriate numpy
# data types

x = np.array(tel['X'].values)
y = np.array(tel['Y'].values)

points = np.array([x, y]).T.reshape(-1, 1, 2)
segments = np.concatenate([points[:-1], points[1:]], axis=1)
gear = tel['nGear'].to_numpy().astype(float)
# sphinx_gallery_defer_figures

##############################################################################
# Create a line collection. Set a segmented colormap and normalize the plot
# to full integer values of the colormap

cmap = cm.get_cmap('Paired')
lc_comp = LineCollection(
    segments, norm=plt.Normalize(1, cmap.N+1), cmap=cmap)
lc_comp.set_array(gear)
lc_comp.set_linewidth(4)
# sphinx_gallery_defer_figures
##############################################################################
# Create the plot
plt.gca().add_collection(lc_comp)
plt.axis('equal')
plt.tick_params(labelleft=False, left=False,
                labelbottom=False, bottom=False)

title = plt.suptitle(
    f"Fastest Lap Gear Shift Visualization\n"
    f"{lap['Driver']} - {session.weekend.name} {session.weekend.year}"
)
##############################################################################
# Add a colorbar to the plot. Shift the colorbar ticks by +0.5 so that they
# are centered for each color segment.
cbar = plt.colorbar(mappable=lc_comp, label="Gear",
                    boundaries=np.arange(1, 10))
cbar.set_ticks(np.arange(1.5, 9.5))
cbar.set_ticklabels(np.arange(1, 9))

plt.savefig(str(s_input)+"g")
print(s_input + "good")
sys.stdout.flush()
