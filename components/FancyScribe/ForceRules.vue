<script setup>
const props = defineProps(['rules', 'onePerPage'])
const keys = Object.keys(props.rules);
</script>

<template>
  <div
			class=
				"avoid-page-break"

		>
			<!-- <label
				class="print-display-none"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-end",
					gap: 4,
					paddingBottom: 2,
				}}
			>
				<input type="checkbox" onChange={() => setHide(!hide)} />
				<span class="print-display-none">Don't print this card.</span>
			</label> -->
			<div
				style="display: flex; flex-direction: column; gap: 8px; padding: var(--size-20); background-color: rgb(223, 224, 226); border: 2px solid var(--primary-color); margin-bottom: 32px;"
			>
					<div
          v-for="rule of keys"
						:key="rule"
						style="line-height: 1.4;"
					>
						<span style="font-weight: 700;">{{rule}}:</span> {{rules[rule] }}
					</div>
			</div>
		</div>
</template>
