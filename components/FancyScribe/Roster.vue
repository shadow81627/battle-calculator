<script setup>
const props = defineProps(['roster', 'onePerPage'])
const { name, cost, forces } = props.roster;
</script>

<template>
		<div
			style="position: relative"
		>
			<div
				class="print-display-none"
				style="
					background-color: var(--primary-color);
					color: #fff;
					padding: 4px 16px;
					font-size:  1.7em;
					font-weight: 800;
					text-transform: uppercase;
					margin-bottom: 12px;
				"
			>
				{{name}} [{{cost.commandPoints}} CP, {{cost.points}} pts]
			</div>
				<FancyScribeForce :key="index" :force="force" :onePerPage="onePerPage" v-for="(force, index) of forces" />
		</div>
</template>
