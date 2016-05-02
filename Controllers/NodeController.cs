﻿// ------------------------------------------------------------
//  Licensed under the MIT License (MIT). See License.txt in the repo root for license information.
// ------------------------------------------------------------

namespace Xray.Controllers
{
    using System.Collections.Generic;
    using System.Fabric;
    using System.Fabric.Query;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNet.Mvc;
    using Xray.Models;

    [Route("api/[controller]")]
    public class NodeController : Controller
    {
        private static readonly IEnumerable<ClusterNodeCapacity> defaultCapacities = new[]
        {
            new ClusterNodeCapacity("Default Replica Count", false, 0, 500, 0, 0, 0)
        };

        private readonly FabricClient client;

        public NodeController(FabricClient client)
        {
            this.client = client;
        }

        [HttpGet("capacity")]
        public async Task<IEnumerable<ClusterNode>> Capacity()
        {
            NodeList nodes = await this.client.QueryManager.GetNodeListAsync();

            List<ClusterNode> result = new List<ClusterNode>(nodes.Count);

            foreach (Node node in nodes)
            {
                NodeLoadInformation loadInfo = await this.client.QueryManager.GetNodeLoadInformationAsync(node.NodeName);

                result.Add(
                    new ClusterNode(
                        node.NodeName,
                        node.NodeStatus.ToString(),
                        node.HealthState.ToString(),
                        node.FaultDomain.ToString(),
                        node.UpgradeDomain,
                        loadInfo.NodeLoadMetricInformationList.Select(
                            x =>
                                new ClusterNodeCapacity(
                                    x.Name,
                                    x.IsCapacityViolation,
                                    x.NodeBufferedCapacity,
                                    x.NodeCapacity,
                                    x.NodeLoad,
                                    x.NodeRemainingBufferedCapacity,
                                    x.NodeRemainingCapacity))
                            .Concat(defaultCapacities)));
            }

            return result;
        }
    }
}